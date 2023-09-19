"use client";

import { env } from "@/env.mjs";
import IntegrationCard from "./integration-card";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/providers/trpc-provider";
import { useToast } from "@/components/ui/use-toast";
import { APP_URL } from "@/lib/constants";

const ZoomIntegration = () => {
  const { toast } = useToast();
  const router = useRouter();

  const { data, isLoading, refetch } = trpc.users.hasIntegration.useQuery({
    type: "ZOOM",
  });

  const removeIntegration = trpc.users.removeIntegration.useMutation({
    async onSuccess() {
      await refetch();
      toast({
        title: "Zoom removed.",
        description: "You have successfully removed the Zoom integration!",
      });
    },
  });

  const openZoomIntegration = () => {
    const redirectUri = encodeURI(`${APP_URL}/api/integration/zoom/connect`);
    const url = `https://zoom.us/oauth/authorize?response_type=code&client_id=${env.NEXT_PUBLIC_ZOOM_CLIENT_ID}&redirect_uri=${redirectUri}`;

    router.push(url);
  };

  return (
    <>
      <IntegrationCard
        loading={isLoading}
        name="Zoom"
        description="Jumpcal will create Zoom Meetings when calls are accepted."
        enabled={data ?? false}
        handleDisable={() =>
          removeIntegration.mutate({
            type: "ZOOM",
          })
        }
        handleEnable={() => {
          openZoomIntegration();
        }}
      />
    </>
  );
};

export default ZoomIntegration;
