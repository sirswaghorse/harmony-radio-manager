
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileAudio, Upload } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function SongUploader() {
  const [uploading, setUploading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const [debug, setDebug] = useState<string[]>([]);
  const [icecastSettings] = useLocalStorage("icecast-settings", {
    hostname: "",
    port: 8000,
    username: "",
    password: "",
    sourcePassword: "",
    mountPoint: "",
    useHttps: false,
    connectionType: "direct",
    useDirectUrl: false,
    directUrl: "",
  });
  
  // Check if we're in a production environment (like Netlify)
  useEffect(() => {
    // This helps detect if we're in Netlify or other production deployment
    const isProductionEnv = window.location.hostname !== 'localhost' && 
                           !window.location.hostname.includes('.lovableproject.com');
    setIsProduction(isProductionEnv);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setDebug([]); // Clear previous debug info

    try {
      const file = files[0];
      addDebugInfo(`Selected file: ${file.name} (${file.type}), size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      
      // Check file size - warn if over 10MB as this may cause 413 errors
      if (file.size > 10 * 1024 * 1024) {
        addDebugInfo(`Warning: File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds 10MB, which may cause upload issues`);
        toast.warning(`Large file detected (${(file.size / 1024 / 1024).toFixed(2)} MB)`, {
          description: "Your file exceeds 10MB which may be rejected by some Icecast servers. Consider reducing the file size."
        });
      }
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error("Please select an audio file");
        addDebugInfo("Error: Not an audio file");
        setUploading(false);
        event.target.value = '';
        return;
      }

      // Check if Icecast settings are configured
      if (!icecastSettings.hostname && !icecastSettings.useDirectUrl) {
        toast.error("Icecast server not configured", {
          description: "Please configure your Icecast server in Settings"
        });
        addDebugInfo("Error: Icecast server not configured");
        setUploading(false);
        event.target.value = '';
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      let uploadUrl;
      
      // Determine the upload URL based on direct URL or components
      if (icecastSettings.useDirectUrl && icecastSettings.directUrl) {
        // Use the direct URL and ensure it ends with a slash for the admin path
        const baseUrl = icecastSettings.directUrl.endsWith('/') 
          ? icecastSettings.directUrl.slice(0, -1) 
          : icecastSettings.directUrl;
        
        uploadUrl = `${baseUrl}/admin/uploadfile`;
        addDebugInfo(`Using direct URL: ${uploadUrl}`);
      } else {
        // Clean hostname (remove any http/https prefix)
        const cleanHostname = icecastSettings.hostname.replace(/^(https?:\/\/)+/i, '');
        
        // Determine protocol
        const protocol = icecastSettings.useHttps ? 'https://' : 'http://';
        
        // Construct the upload URL
        uploadUrl = `${protocol}${cleanHostname}:${icecastSettings.port}/admin/uploadfile`;
      }
      
      // If using CORS proxy
      if (icecastSettings.connectionType === "cors-proxy") {
        uploadUrl = `/api/icecast-proxy?url=${encodeURIComponent(uploadUrl)}&method=POST`;
        addDebugInfo(`Using CORS proxy for upload to: ${uploadUrl}`);
      } else {
        addDebugInfo(`Direct upload to: ${uploadUrl}`);
      }
      
      console.log(`Attempting upload to: ${uploadUrl}`);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for large files
      
      try {
        // Attempt upload
        addDebugInfo(`Starting upload of ${file.name}...`);
        
        // Check which password to use - admin password for admin functions, source password for source functions
        const authPassword = uploadUrl.includes('/admin/') ? icecastSettings.password : icecastSettings.sourcePassword;
        const authUsername = uploadUrl.includes('/admin/') ? icecastSettings.username : 'source';
        
        addDebugInfo(`Using authentication: ${authUsername}:******* for ${uploadUrl.includes('/admin/') ? 'admin' : 'source'} operation`);
        
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          headers: icecastSettings.connectionType === "direct" ? {
            'Authorization': 'Basic ' + btoa(`${authUsername}:${authPassword}`)
          } : {},
          signal: controller.signal
        });
  
        clearTimeout(timeoutId);
        addDebugInfo(`Upload response status: ${response.status}`);
  
        if (response.ok) {
          toast.success("Song uploaded successfully", {
            description: file.name
          });
          addDebugInfo("Upload successful");
        } else if (response.status === 413) {
          throw new Error("File too large (HTTP 413). Your Icecast server has rejected this file due to its size. Try a smaller file or adjust server settings.");
        } else {
          const responseText = await response.text().catch(() => "Could not get response text");
          addDebugInfo(`Server response: ${responseText.substring(0, 100)}${responseText.length > 100 ? '...' : ''}`);
          throw new Error(`Upload failed with status: ${response.status}`);
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        console.error("Upload fetch error:", fetchError);
        addDebugInfo(`Fetch error: ${fetchError.name} - ${fetchError.message}`);
        
        if (fetchError.message && fetchError.message.includes("413")) {
          toast.error("File size too large", {
            description: "The server rejected this file because it's too large. Try a smaller file or adjust your Icecast server's file size limit.",
            action: {
              label: "Show Details",
              onClick: () => {
                toast.message("Debug Information", {
                  description: debug.join("\n")
                });
              }
            }
          });
          addDebugInfo("413 error - file too large for server");
        } else if (fetchError instanceof TypeError && fetchError.message.includes("NetworkError")) {
          toast.error("Upload failed due to network restrictions", {
            description: "This might be due to CORS policy. Try using the CORS Proxy option in Settings > Icecast Server > Advanced Options",
            action: {
              label: "Show Details",
              onClick: () => {
                toast.message("Debug Information", {
                  description: debug.join("\n")
                });
              }
            }
          });
          
          addDebugInfo("Network error detected - likely CORS related");
          
        } else if (fetchError.name === 'AbortError') {
          toast.error("Upload timed out", {
            description: "The server took too long to respond. This can happen with large files. Try a smaller file or check your connection.",
            action: {
              label: "Show Details",
              onClick: () => {
                toast.message("Debug Information", {
                  description: debug.join("\n")
                });
              }
            }
          });
          addDebugInfo("Request timed out");
        } else {
          toast.error("Upload failed", {
            description: fetchError.message,
            action: {
              label: "Show Details",
              onClick: () => {
                toast.message("Debug Information", {
                  description: debug.join("\n")
                });
              }
            }
          });
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      addDebugInfo(`General error: ${error.message}`);
      toast.error("Failed to upload song", {
        description: "Make sure your Icecast server is properly configured and running",
        action: {
          label: "Show Details",
          onClick: () => {
            toast.message("Debug Information", {
              description: debug.join("\n")
            });
          }
        }
      });
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const addDebugInfo = (info: string) => {
    console.log(`[Uploader Debug] ${info}`);
    setDebug(prev => [...prev, `${new Date().toISOString().substring(11, 19)} - ${info}`]);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="max-w-[300px]"
      />
      <Button
        variant="outline"
        disabled={uploading}
      >
        {uploading ? (
          <>
            <FileAudio className="mr-2 h-4 w-4 animate-pulse" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Songs
          </>
        )}
      </Button>
    </div>
  );
}
