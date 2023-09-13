"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/providers/trpc-provider";
import { ArchiveX, ArrowRight } from "lucide-react";
import IncomingCalls from "./incoming-calls";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RootContainer = () => {
  const { data, isLoading } = trpc.users.hasIntegrations.useQuery();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!data) {
    return (
      <div className="bg-white border border-neutral-200 flex items-center justify-center flex-col space-y-2 p-4 text-neutral-400">
        <ArchiveX className="h-6 w-6" />
        <p className="text-lg">
          You need to enable call integrations before you can start taking
          calls.
        </p>
        <Link
          href="/settings/integrations"
          className={cn(
            buttonVariants({
              variant: "default",
            }),
            "w-72 mt-2",
          )}
        >
          Enable Integrations <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <IncomingCalls />
      <Separator className="my-4" />
    </>
  );
};

export default RootContainer;
