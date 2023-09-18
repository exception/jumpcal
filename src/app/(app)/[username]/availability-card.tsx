"use client";

import { Button } from "@/components/ui/button";
import { type DayAvailability, isUserAvailable } from "@/lib/availability";
import { cn, firstName } from "@/lib/utils";
import { type Layout } from "@prisma/client";
import { ArrowDown, ArrowRight } from "lucide-react";
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

interface Props {
  id: string;
  availability: DayAvailability[];
  timezone: string;
  layout: Layout;
  name: string;
}

const AvailabilityCard = ({
  id,
  availability,
  timezone,
  layout = "VERTICAL",
  name,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const available = isUserAvailable(availability, timezone);
  const { data: session } = useSession();
  const displayName = firstName(name) ?? name;

  const isSelf = session?.user.id === id;

  return (
    <motion.div
      className={cn(
        "w-full grow-0 rounded-md bg-white border border-neutral-200 p-4",
        layout === "VERTICAL" && "max-w-4xl",
      )}
    >
      <AnimatePresence key={"av-card"}>
        {available ? (
          <div className="flex space-x-2 items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-green-400 text-sm font-normal">Available now</p>
          </div>
        ) : (
          <div className="flex space-x-2 items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
            <p className="text-yellow-400 text-sm font-normal">Away</p>
          </div>
        )}
        <motion.div
          key={"available-chat"}
          className="flex items-center justify-between"
        >
          <div className="flex flex-col">
            <p className="text-lg font-medium">
              {available
                ? "I can chat right now!"
                : `${displayName} is away right now.`}
            </p>
            {!available && (
              <p className="text-sm font-normal text-neutral-400">
                You can schedule a call with {displayName} using the cards
                below, if not, you can wait for {displayName} to be available
                again!
              </p>
            )}
          </div>
          {available && (
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
