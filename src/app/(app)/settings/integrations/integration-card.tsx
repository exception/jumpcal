"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Props {
  type?: "NOTIFICATION" | "CALL" | "CALENDAR";
  enabled: boolean;
  name: string;
  description: string;
  loading: boolean;

  handleEnable: () => Promise<void> | void;
  handleDisable: () => Promise<void> | void;
}

const integrationCopy = ({ type, name }: Pick<Props, "type" | "name">) => {
  switch (type) {
    case "CALL":
      return `You are about to enable the ${name} integration. You will be
      redirected to ${name}'s website to finish the setup.`;
    case "NOTIFICATION":
      return `You are about to enable notifications via ${name}.`;
    case "CALENDAR":
      return `You are about to connect your ${name} Calendar to Jumpcal. We will only use this connection to check your availability.`;
  }
};

const IntegrationCard = ({
  enabled,
  name,
  description,
  handleEnable,
  handleDisable,
  loading,
  type = "CALL",
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [enabling, setEnabling] = useState(false);

  const startEnable = async () => {
    try {
      setEnabling(true);
      await handleEnable();
    } finally {
      setModalOpen(false);
      setEnabling(false);
    }
  };

  const handleValueChange = async (checked: boolean) => {
    if (checked) {
      setModalOpen(true);
    } else {
      await handleDisable();
    }
  };

  return (
    <>
      <div className="border rounded-md p-4 bg-white border-neutral-200 w-full flex flex-row justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-base font-medium">{name}</h3>
          <p className="text-neutral-400 text-sm">{description}</p>
        </div>
        {loading && <Skeleton className="w-12 h-6 rounded-full" />}
        {!loading && (
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          <Switch checked={enabled} onCheckedChange={handleValueChange} />
        )}
      </div>
      <Modal open={modalOpen} setOpen={setModalOpen}>
        <div className="flex flex-col space-y-2 w-full">
          <h2 className="text-lg font-medium">Enable {name}</h2>
          <p className="text-sm text-neutral-400">
            {integrationCopy({ type, name })}
          </p>
          <Separator className="!my-3" />
          <div className="flex flex-row space-x-2">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              loading={enabling}
              className="w-full"
              onClick={startEnable}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default IntegrationCard;
