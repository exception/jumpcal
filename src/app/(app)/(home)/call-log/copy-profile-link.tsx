"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, Clipboard } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

const CopyProfileLink = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  return (
    <Button
      icon={
        copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )
      }
      onClick={() => {
        setCopied(true);
        navigator.clipboard.writeText(
          `https://jumpcal.com/${session?.user.username}`,
        );
        toast({
          title: "Copied link to clipboard!",
        });

        setTimeout(() => {
          setCopied(false);
        }, 2500);
      }}
    >
      {copied ? "Copied" : "Copy Profile Link"}
    </Button>
  );
};

export default CopyProfileLink;
