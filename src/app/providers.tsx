"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import IncomingCallsProvider from "@/lib/providers/incoming-calls-provider";
import { TrpcProvider } from "@/lib/providers/trpc-provider";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <SessionProvider>
      <TrpcProvider>
        <IncomingCallsProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </IncomingCallsProvider>
      </TrpcProvider>
      <Toaster />
    </SessionProvider>
  );
};

export default Providers;
