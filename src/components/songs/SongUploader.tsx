
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileAudio, Upload } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function SongUploader() {
  const [uploading, setUploading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const [icecastSettings] = useLocalStorage("icecast-settings", {
    hostname: "",
    port: 8000,
    username: "",
    password: "",
    mountPoint: "",
    useHttps: false,
    connectionType: "direct",
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

    try {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error("Please select an audio file");
        setUploading(false);
        event.target.value = '';
        return;
      }

      // Check if Icecast settings are configured
      if (!icecastSettings.hostname) {
        toast.error("Icecast server not configured", {
          description: "Please configure your Icecast server in Settings"
        });
        setUploading(false);
        event.target.value = '';
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Clean hostname (remove any http/https prefix)
      const cleanHostname = icecastSettings.hostname.replace(/^(https?:\/\/)+/i, '');
      
      // Determine protocol
      const protocol = icecastSettings.useHttps ? 'https://' : 'http://';
      
      // Construct the upload URL
      let uploadUrl = `${protocol}${cleanHostname}:${icecastSettings.port}/admin/uploadfile`;
      
      // If using CORS proxy
      if (icecastSettings.connectionType === "cors-proxy") {
        uploadUrl = `/api/icecast-proxy?url=${encodeURIComponent(uploadUrl)}&method=POST`;
      }
      
      console.log(`Attempting upload to: ${uploadUrl}`);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        // Attempt upload
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          headers: icecastSettings.connectionType === "direct" ? {
            'Authorization': 'Basic ' + btoa(`${icecastSettings.username}:${icecastSettings.password}`)
          } : {},
          signal: controller.signal
        });
  
        clearTimeout(timeoutId);
  
        if (response.ok) {
          toast.success("Song uploaded successfully", {
            description: file.name
          });
        } else {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        console.error("Upload fetch error:", fetchError);
        
        if (fetchError instanceof TypeError && fetchError.message.includes("NetworkError")) {
          toast.error("Upload failed due to network restrictions", {
            description: "This might be due to CORS policy. Try using the CORS Proxy option in Settings > Icecast Server > Advanced Options"
          });
        } else if (fetchError.name === 'AbortError') {
          toast.error("Upload timed out", {
            description: "The server took too long to respond. Check your connection and server status."
          });
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload song", {
        description: "Make sure your Icecast server is properly configured and running"
      });
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
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
