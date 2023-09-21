"use client";

import { Button } from "@/components/ui/button";
import { type DayAvailability } from "@/lib/availability";
import { cn, firstName } from "@/lib/utils";
import { type Layout } from "@prisma/client";
import { ArrowDown, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CallCard from "./call-card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/providers/trpc-provider";

interface Props {
  id: string;
  availability: DayAvailability[];
  timezone: string;
  layout: Layout;
  name: string;
}

type Status = "online" | "busy" | "offline";

const availableStatus = ({ status }: { status: Status }) => {
  if (status === "busy") {
    return (
      <div className="flex space-x-2 items-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
        <p className="text-yellow-400 text-sm font-normal">Away</p>
      </div>
    );
  } else if (status === "offline") {
    return (
      <div className="flex space-x-2 items-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-500"></span>
        </span>
        <p className="text-neutral-400 text-sm font-normal">Offline</p>
      </div>
    );
  } else {
    return (
      <div className="flex space-x-2 items-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <p className="text-green-400 text-sm font-normal">Available now</p>
      </div>
    );
  }
};

const AvailabilityCard = ({ id, layout = "VERTICAL", name }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { data: available, isLoading } = trpc.users.isUserAvailable.useQuery(
    {
      userId: id,
    },
    {
      enabled: !!id,
    },
  );
  const { data: session } = useSession();
  const displayName = firstName(name) ?? name;

  const isSelf = session?.user.id === id;

  if (isLoading || !available?.status) {
    return (
      <div
        className={cn(
          "w-full grow-0 rounded-md bg-white border border-neutral-200 p-4",
          layout === "VERTICAL" && "max-w-4xl",
        )}
      >
        <div className="flex space-x-2 items-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          <p className="text-lg font-medium">
            Loading {displayName}&apos;s availability...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "w-full grow-0 rounded-md bg-white border border-neutral-200 p-4",
        layout === "VERTICAL" && "max-w-4xl",
      )}
    >
      <AnimatePresence key={"av-card"}>
        {availableStatus({ status: available.status as Status })}
        <motion.div
          key={"available-chat"}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-col">
            <p className="text-lg font-medium">
              {available?.status === "online"
                ? "I can chat right now!"
                : `${displayName} is away right now.`}
            </p>
            {available?.status !== "online" && (
              <p className="text-sm font-normal text-neutral-400">
                You can schedule a call with {displayName} using the cards
                below, if not, you can wait for {displayName} to be available
                again!
              </p>
            )}
          </div>
          {available?.status === "online" && (
            <>
              {isSelf ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="sm"
                      disabled={isSelf}
                      onClick={() => setExpanded(!expanded)}
                    >
                      Call me! <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="w-40 text-center">
                    <p>Calling is disabled as this is your own profile.</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  size="sm"
                  disabled={isSelf}
                  onClick={() => setExpanded(!expanded)}
                  className="mt-4 md:mt-0"
                >
                  Call me!{" "}
                  {expanded ? (
                    <ArrowDown className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              )}
            </>
          )}
        </motion.div>
        {expanded && (
          <motion.div
            key="expanded-chat"
            variants={{
              open: { opacity: 1 },
              collapsed: { opacity: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            initial="collapsed"
            exit="collapsed"
            animate="open"
          >
            <Separator className="mt-4 mb-2" />
            <CallCard target={id} name={displayName} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AvailabilityCard;
