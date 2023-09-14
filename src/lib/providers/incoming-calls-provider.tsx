import { useToast } from "@/components/ui/use-toast";
import { Call } from "@prisma/client";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { trpc } from "./trpc-provider";
import { useSession } from "next-auth/react";

interface ContextProps {
  isInitialLoading: boolean;
  isRefetching: boolean;
  calls: Call[];
}

const Context = React.createContext<ContextProps>({
  isInitialLoading: true,
  isRefetching: false,
  calls: [],
});

const IncomingCallsProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const [previousCalls, setPreviousCalls] = useState<Call[]>([]);
  const { status } = useSession();

  const {
    data: incomingCalls,
    isInitialLoading,
    isRefetching,
  } = trpc.calls.incomingCalls.useQuery(undefined, {
    refetchInterval: 3_000, // 3 seconds
    refetchIntervalInBackground: true,
    retry: true,
    retryDelay: (attempt) => attempt * 1000,
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (status !== "authenticated") return;

    if (pathname !== "/") {
      if (incomingCalls) {
        if (incomingCalls?.length !== previousCalls.length) {
          toast({
            title: "New Incoming calls",
            description: "There are new incoming calls.",
          });
        }
      }
    }

    setPreviousCalls(incomingCalls ?? []);
  }, [pathname, incomingCalls, previousCalls, status]);

  return (
    <Context.Provider
      value={{ isRefetching, isInitialLoading, calls: incomingCalls ?? [] }}
    >
      {children}
    </Context.Provider>
  );
};

export const useIncomingCalls = () => {
  return useContext(Context);
};

export default IncomingCallsProvider;
