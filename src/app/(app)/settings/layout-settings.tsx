"use client";

import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/providers/trpc-provider";
import { Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const LayoutSettings = () => {
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const updateLayout = trpc.users.update.useMutation({
    async onSuccess() {
      await update();
      toast({
        title: "Layout settings saved.",
      });
    },
  });

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-sm font-medium leading-none">Layout</p>
      <p className="text-sm font-normal text-neutral-400">
        How your profile is rendered.
      </p>
      <div className="flex flex-col space-y-2 md:space-y-0 md:space-x-2 md:flex-row w-full">
        <div
          onClick={() =>
            updateLayout.mutate({
              layout: "VERTICAL",
            })
          }
          className="w-full p-4 rounded-md border border-neutral-200 bg-white flex items-center flex-col relative hover:cursor-pointer active:scale-95 transition-all"
        >
          {session?.user.layout === "VERTICAL" && (
            <div className="absolute rounded-full p-2 top-2 right-2 bg-neutral-100 text-neutral-900">
              {updateLayout.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </div>
          )}
          <div className="space-y-1 w-full items-center flex flex-col">
            <div className="rounded-full bg-neutral-200 h-8 w-8"></div>
            <div className="rounded-sm bg-neutral-200 h-4 w-full"></div>
            <div className="rounded-sm bg-neutral-200 h-4 w-full"></div>
          </div>
        </div>
        <div
          onClick={() =>
            updateLayout.mutate({
              layout: "HORIZONTAL",
            })
          }
          className="w-full p-4 rounded-md border border-neutral-200 bg-white flex items-center flex-row relative hover:cursor-pointer active:scale-95 transition-all"
        >
          {session?.user.layout === "HORIZONTAL" && (
            <div className="absolute rounded-full p-2 top-2 right-2 bg-neutral-100 text-neutral-900">
              {updateLayout.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </div>
          )}
          <div className="space-x-1 w-full items-center flex flex-row">
            <div className="rounded-full bg-neutral-200 h-8 w-8 shrink-0"></div>
            <div className="flex flex-col space-y-1 w-full">
              <div className="rounded-sm bg-neutral-200 h-4 w-full"></div>
              <div className="rounded-sm bg-neutral-200 h-4 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutSettings;
