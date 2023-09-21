"use client";

import SettingsContainer from "../settings-container";
import ZoomIntegration from "./zoom-integration";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import GoogleCalendarIntegration from "./google-calendar-integration";
import CalendarTools from "./calendar-tools";

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
      description="How Jumpcal interacts with your already existing tools."
    >
      <ZoomIntegration />
      <GoogleCalendarIntegration />
      <CalendarTools />
    </SettingsContainer>
  );
};

export default IntegrationSettings;
