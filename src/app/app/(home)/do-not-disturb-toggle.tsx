"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/providers/trpc-provider";

const DoNotDisturbToggle = () => {
  const { data, isLoading, refetch } = trpc.users.dndStatus.useQuery();
  const toggleDnd = trpc.users.toggleDnd.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  if (isLoading) {
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
        <TooltipContent className="w-40 text-center">
          <p>
            While on Do not Disturb, you will still be able to receive calls but
            you will get no notifications.
          </p>
        </TooltipContent>
      </Tooltip>
      <Switch
        checked={data}
        onCheckedChange={(checked) => toggleDnd.mutate({ state: checked })}
      />
    </div>
  );
};

export default DoNotDisturbToggle;
