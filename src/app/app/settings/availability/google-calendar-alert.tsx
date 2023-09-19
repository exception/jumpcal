"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { trpc } from "@/lib/providers/trpc-provider";
import { Info } from "lucide-react";

const GoogleCalendarAlert = () => {
  const { data, isLoading } = trpc.users.hasIntegration.useQuery({
    type: "CALENDAR_GCAL",
  });

  if (!data || isLoading) {
    return <></>;
  }

  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You have the Google Calendar integration enabled. You will show as busy
        if you have an ongoing event!
      </AlertDescription>
    </Alert>
  );
};

export default GoogleCalendarAlert;
