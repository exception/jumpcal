"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import IncomingCallsProvider from "@/lib/providers/incoming-calls-provider";
import { TrpcProvider } from "@/lib/providers/trpc-provider";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

const Providers = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <SessionProvider>
      {/* TIMEZONE CHECK */}
      <TrpcProvider>
        <IncomingCallsProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </IncomingCallsProvider>
      </TrpcProvider>
      <Toaster />
      <Analytics />
    </SessionProvider>
  );
};

export default Providers;
