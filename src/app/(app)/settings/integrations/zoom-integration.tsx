"use client";

import { env } from "@/env.mjs";
import IntegrationCard from "./integration-card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/providers/trpc-provider";
import Modal from "@/components/ui/modal";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ZoomIntegration = () => {
  const searchParams = useSearchParams();
  const zoom = searchParams?.get("zoom");
  const code = searchParams?.get("code");
  const { toast } = useToast();

  const { data, isLoading, refetch } = trpc.users.hasIntegration.useQuery({
    type: "ZOOM",
  });

  const enableIntegration = trpc.users.addIntegration.useMutation({
    async onSuccess() {
      await refetch();
      setIntegrating(false);
      toast({
        title: "Zoom enabled.",
        description: "You have successfully enabled the Zoom integration!",
      });
    },
    onError() {
      setIntegrating(false);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
      });
    },
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

  const [integrating, setIntegrating] = useState(false);

  useEffect(() => {
    if (zoom && code) {
      setIntegrating(true);
      enableIntegration.mutate({ type: "ZOOM", code });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openZoomIntegration = () => {
    const url = `https://zoom.us/oauth/authorize?response_type=code&client_id=${env.NEXT_PUBLIC_ZOOM_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsettings%2Fintegrations%3Fzoom%3Dtrue`;
    window.location.replace(url);
  };

  return (
    <>
      <Modal open={integrating} setOpen={() => void 0}>
        <h2 className="text-lg font-medium">Finishing Zoom Integration</h2>
        <p className="text-sm text-neutral-400">
          We are validating Zoom&apos;s response, your work here is done!
        </p>
        <div className="w-full py-3 rounded-md bg-neutral-950 text-neutral-100 justify-center flex">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </Modal>
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
