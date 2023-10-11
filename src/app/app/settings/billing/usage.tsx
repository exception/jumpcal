"use client";

import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/providers/trpc-provider";
import { useSession } from "next-auth/react";

const Usage = () => {
  const { status } = useSession();
  const { data, isLoading } = trpc.users.usage.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (isLoading) {
    return <Skeleton className="w-full h-20" />;
  }

  return (
    <div className="w-full p-4 rounded-md border border-neutral-200 bg-white flex flex-col space-y-2">
      <h3 className="text-base font-medium">Your Monthly Usage</h3>
      <Progress
        value={((data?.usage ?? 0) / (data?.max ?? 50)) * 100}
        className="w-full"
      />
      <p className="self-end text-neutral-400 text-sm">
        {data?.usage ?? 0} / {data?.max ?? 50}
      </p>
    </div>
  );
};

export default Usage;
