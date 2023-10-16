import { useToast } from "@/components/ui/use-toast";
import { type Call } from "@prisma/client";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useRef } from "react";
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
  const { status } = useSession();
  const { data: hasIntegrations } = trpc.users.hasIntegrations.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
    },
  );

  // todo update time if available/not available

  const {
    data: incomingCalls,
    isInitialLoading,
    isRefetching,
  } = trpc.calls.incomingCalls.useQuery(undefined, {
    refetchInterval: 5_000, // 5 seconds
    refetchIntervalInBackground: true,
    retry: true,
    retryDelay: (attempt) => attempt * 1000,
    // only fetch incoming calls if user is authenticated and has integrations
    enabled: status === "authenticated" && hasIntegrations,
  });

  const previousCallsRef = useRef(0);

  useEffect(() => {
    if (
      status === "authenticated" &&
      pathname !== "/" &&
      incomingCalls &&
      incomingCalls.length !== previousCallsRef.current
    ) {
      toast({
        title: "New Incoming calls",
      });
    }

    // ! FIX: length check is not very reliable here.
    previousCallsRef.current = incomingCalls?.length ?? 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, incomingCalls, status]);

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
