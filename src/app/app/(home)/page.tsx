"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/providers/trpc-provider";
import { ArrowRight } from "lucide-react";
import IncomingCalls from "./incoming-calls";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const RootContainer = () => {
  const { data, isLoading } = trpc.users.hasIntegrations.useQuery();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!data) {
    return (
      <div className="bg-white border border-neutral-200 flex items-center justify-center flex-col space-y-2 p-4 text-neutral-500">
        <Image
          src={"/_static/svgs/late-for-meeting.svg"}
          alt="No Integrations"
          width={300}
          height={300}
          className="pointer-events-none"
        />
        <p className="text-base md:text-lg text-center">
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

  return <IncomingCalls />;
};

export default RootContainer;
