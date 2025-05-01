
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
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
      <AlertDescription className="ml-2">
        {result.message}
      </AlertDescription>
    </Alert>
  );
}
