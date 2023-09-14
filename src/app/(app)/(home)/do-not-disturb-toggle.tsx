"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
      <p className="text-sm text-neutral-400 hidden md:block">Do not Disturb</p>
      <Switch
        checked={data}
        onCheckedChange={(checked) => toggleDnd.mutate({ state: checked })}
      />
    </div>
  );
};

export default DoNotDisturbToggle;
