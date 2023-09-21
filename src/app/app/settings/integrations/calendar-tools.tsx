"use client";

import { useSession } from "next-auth/react";
import NoCalendarTools from "./no-calendar-tool";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { trpc } from "@/lib/providers/trpc-provider";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const CalendarTools = () => {
  const { data: session, update, status } = useSession();
  const { toast } = useToast();

  const isCal = session?.user.calendarLink?.includes("cal.com");

  const removeCalendarLink = trpc.users.update.useMutation({
    async onSuccess() {
      await update();
      toast({
        title: "Successfully removed scheduling tool.",
      });
    },
  });

  if (status === "loading") {
    return (
      <div className="flex flex-col space-y-4 w-full !mt-8">
        <div>
          <h3 className="text-lg font-medium">Scheduling Tools</h3>
          <p className="text-sm text-neutral-400">
            How your callers can schedule time with you when you&apos;re unable
            to answer.
          </p>
        </div>
        <Separator className="w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!session?.user?.calendarLink) {
    return <NoCalendarTools />;
  }

  return (
    <div className="flex flex-col space-y-4 w-full !mt-8">
      <div>
        <h3 className="text-lg font-medium">Scheduling Tools</h3>
        <p className="text-sm text-neutral-400">
          How your callers can schedule time with you when you&apos;re unable to
          answer.
        </p>
      </div>
      <Separator className="w-full" />
      <div className="rounded-md bg-white p-4 flex border border-neutral-200  items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-base font-medium">
            {isCal ? "Cal.com" : "Calendly"} Embed
          </h3>
          <Link href={session.user.calendarLink} target="_blank">
            <p className="text-neutral-400 text-sm">
              {session.user.calendarLink}
            </p>
          </Link>
        </div>
        <Switch
          checked
          onCheckedChange={() =>
            removeCalendarLink.mutate({
              calendarLink: null,
            })
          }
        />
      </div>
    </div>
  );
};

export default CalendarTools;
