"use client";

import { trpc } from "@/lib/providers/trpc-provider";
import { type NotificationType } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useContext } from "react";

interface ProviderContext {
  isLoading: boolean;
  types: Set<NotificationType>;
  refetch: () => Promise<unknown>;
}

const Context = React.createContext<ProviderContext>({
  isLoading: true,
  types: new Set<NotificationType>(),
  refetch: () => Promise.resolve(),
});

export const NotificationProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const { status } = useSession();
  const { data, isLoading, refetch } = trpc.notifications.get.useQuery(
    {
      in: ["SMS", "WHATSAPP"],
    },
    {
      enabled: status === "authenticated",
    },
  );

  return (
    <Context.Provider
      value={{
        isLoading,
        types: data ?? new Set<NotificationType>(),
        refetch,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useNotifications = () => {
  return useContext(Context);
};
