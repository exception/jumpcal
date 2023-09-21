"use client";

import { trpc } from "@/lib/providers/trpc-provider";
import { type AppRouter } from "@/server/root";
import { type NotificationType } from "@prisma/client";
import { type inferProcedureOutput } from "@trpc/server";
import { useSession } from "next-auth/react";
import React, { useContext } from "react";

type ElementType = inferProcedureOutput<
  AppRouter["_def"]["procedures"]["notifications"]["get"]
>;
type GetElementType<T extends unknown[]> = T extends (infer U)[] ? U : never;

interface ProviderContext {
  isLoading: boolean;
  types: ElementType;
  refetch: () => Promise<unknown>;
  get: (type: NotificationType) => GetElementType<ElementType> | undefined;
}

const Context = React.createContext<ProviderContext>({
  isLoading: true,
  types: [],
  refetch: () => Promise.resolve(),
  get: () => undefined,
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
        types: data ?? [],
        refetch,
        get: (t) => (data ?? []).find((el) => el.type === t),
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useNotifications = () => {
  return useContext(Context);
};
