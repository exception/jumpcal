"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/providers/trpc-provider";
import { useSession } from "next-auth/react";

const DoNotDisturbToggle = () => {
  const { data: session, update, status } = useSession();
  const toggleDnd = trpc.users.toggleDnd.useMutation({
    async onSuccess() {
      await update();
    },
  });

  if (status !== "authenticated") {
    return <Skeleton className="w-40 h-6" />;
  }

  return (
    <div className="flex flex-row space-x-2 items-center">
      <Tooltip>
        <TooltipTrigger>
          <p className="text-sm text-neutral-400 hidden md:block">
            Do not Disturb
          </p>
        </TooltipTrigger>
        <TooltipContent side="left" className="w-52 text-center">
          <p className="text-neutral-500">
            While on <span className="font-medium">Do not Disturb</span>, you
            will still be able to receive calls but you will get no
            notifications.
          </p>
        </TooltipContent>
      </Tooltip>
      <Switch
        checked={session.user.dnd}
        onCheckedChange={(checked) => toggleDnd.mutate({ state: checked })}
      />
    </div>
  );
};

export default DoNotDisturbToggle;
