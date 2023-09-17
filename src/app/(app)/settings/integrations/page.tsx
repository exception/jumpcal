"use client";

import SettingsContainer from "../settings-container";
import ZoomIntegration from "./zoom-integration";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const IntegrationSettings = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Something went wrong",
        description: error,
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <SettingsContainer
      title="Integrations"
      description="Allow Jumpcal to schedule calls on your behalf."
    >
      <ZoomIntegration />
    </SettingsContainer>
  );
};

export default IntegrationSettings;
