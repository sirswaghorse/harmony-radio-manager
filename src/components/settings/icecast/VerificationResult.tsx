
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { VerificationResult as VerificationResultType } from "./use-icecast-verification";

interface VerificationResultProps {
  result: VerificationResultType;
}

export function VerificationResultDisplay({ result }: VerificationResultProps) {
  if (!result) return null;

  return (
    <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
      {result.success ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <div>
        <AlertTitle className="ml-2 font-medium">
          {result.success ? "Success" : "Connection Issue"}
        </AlertTitle>
        <AlertDescription className="ml-2">
          {result.message}
          {result.success && (
            <div className="mt-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 inline mr-1" />
              Note: Connection success only verifies basic connectivity. Upload capabilities may have additional limitations (like file size restrictions).
            </div>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}
