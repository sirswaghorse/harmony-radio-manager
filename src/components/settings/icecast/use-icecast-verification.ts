
import { useState } from "react";
import { IcecastSettings } from "./icecast-schema";

export type VerificationResult = { success: boolean; message: string } | null;

export function useIcecastVerification() {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(null);

  const verifyConnection = async (values: IcecastSettings) => {
    setVerifying(true);
    setVerificationResult(null);
    
    try {
      // Fixed URL formation - remove any accidental double http:// or https://
      const cleanHostname = values.hostname.replace(/^(https?:\/\/)+/i, '');
      
      // Determine which protocol to use
      const protocol = values.useHttps ? 'https://' : 'http://';
      
      // For direct connection
      let url = `${protocol}${cleanHostname}:${values.port}/status-json.xsl`;
      
      // If using CORS proxy
      if (values.connectionType === "cors-proxy") {
        url = `/api/icecast-proxy?url=${encodeURIComponent(url)}`;
      }
      
      console.log(`Attempting connection to: ${url}`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(url, {
          headers: values.connectionType === "direct" ? {
            'Authorization': 'Basic ' + btoa(`${values.username}:${values.password}`)
          } : {},
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          try {
            // Try to parse as JSON to verify it's a valid Icecast response
            const data = await response.json();
            if (data?.icestats) {
              setVerificationResult({
                success: true,
                message: `Successfully connected to Icecast server via ${values.useHttps ? 'HTTPS' : 'HTTP'}!`
              });
            } else {
              throw new Error("Response is not a valid Icecast status");
            }
          } catch (parseError) {
            setVerificationResult({
              success: false,
              message: "Server responded but did not return valid Icecast data. Check if this is actually an Icecast server."
            });
          }
        } else {
          setVerificationResult({
            success: false,
            message: `Server returned error ${response.status}. Check your credentials.`
          });
        }
      } catch (error: any) {
        console.error("Connection error:", error);
        
        if (error instanceof TypeError && error.message.includes("NetworkError")) {
          setVerificationResult({
            success: false,
            message: "Connection failed due to network restrictions. Try using the CORS proxy option in the Advanced settings tab."
          });
        } else if (error.name === 'AbortError') {
          setVerificationResult({
            success: false,
            message: "Connection timed out. The server may be unreachable or slow to respond."
          });
        } else {
          setVerificationResult({
            success: false,
            message: "Connection failed. This may be due to CORS restrictions, the server being unreachable, or incorrect settings."
          });
        }
      }
    } catch (error) {
      console.error("Connection verification general error:", error);
      setVerificationResult({
        success: false,
        message: "Connection failed. Please verify the server address and credentials."
      });
    } finally {
      setVerifying(false);
    }
  };

  return { verifying, verificationResult, verifyConnection };
}
