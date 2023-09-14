"use client";

import { Toaster } from "@/components/ui/toaster";
import IncomingCallsProvider from "@/lib/providers/incoming-calls-provider";
import { TrpcProvider } from "@/lib/providers/trpc-provider";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

const Providers = ({
  children,
  session,
}: React.PropsWithChildren<{ session: Session | null }>) => {
  return (
    <SessionProvider session={session}>
      <TrpcProvider>
        <IncomingCallsProvider>{children}</IncomingCallsProvider>
      </TrpcProvider>
      <Toaster />
    </SessionProvider>
  );
};

export default Providers;
