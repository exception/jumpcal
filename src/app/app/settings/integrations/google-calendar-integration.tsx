"use client";

import IntegrationCard from "./integration-card";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/providers/trpc-provider";
import { useToast } from "@/components/ui/use-toast";

const GoogleCalendarIntegration = () => {
  const { toast } = useToast();
  const router = useRouter();

  const { data, isLoading, refetch } = trpc.users.hasIntegration.useQuery({
    type: "CALENDAR_GCAL",
  });

  const googleAuthMutation =
    trpc.integrations.generateGoogleOAuthUrl.useMutation();

  const removeIntegration = trpc.users.removeIntegration.useMutation({
    async onSuccess() {
      await refetch();
      toast({
        title: "Google Calendar removed.",
        description:
          "You have successfully removed the Google Calendar integration!",
      });
    },
  });

  return (
    <>
      <IntegrationCard
        loading={isLoading}
        name="Google Calendar"
        description="Jumpcal will use Google Calendar to check your availability."
        enabled={data ?? false}
        handleDisable={() =>
          removeIntegration.mutate({
            type: "CALENDAR_GCAL",
          })
        }
        handleEnable={async () => {
          await googleAuthMutation.mutateAsync().then((res) => {
            router.push(res);
          });
        }}
      />
    </>
  );
};

export default GoogleCalendarIntegration;
