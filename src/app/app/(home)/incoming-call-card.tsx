"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  type CountryCode,
  countryNameRecord,
  getCountryFlagEmoji,
} from "@/lib/constants";
import { trpc } from "@/lib/providers/trpc-provider";
import { type Call } from "@prisma/client";
import { PhoneCall, PhoneMissed } from "lucide-react";

interface Props {
  call: Pick<
    Call,
    "id" | "countryCode" | "callerEmail" | "callerName" | "callerReason"
  >;
}

const IncomingCallCard = ({ call }: Props) => {
  const utils = trpc.useContext();
  const { toast } = useToast();
  const { data: usage } = trpc.users.usage.useQuery();

  const tryAcceptCall = () => {
    if (!usage) {
      acceptCall.mutate({
        callId: call.id,
      });
    } else {
      if (usage.usage >= usage.max) {
        toast({
          variant: "destructive",
          title: "Exceeded monthly usage quota.",
          description: "To continue using Jumpcal, please upgrade your plan.",
        });
      } else {
        acceptCall.mutate({
          callId: call.id,
        });
      }
    }
  };

  const rejectCall = trpc.calls.reject.useMutation({
    async onSuccess() {
      await utils.calls.incomingCalls.refetch();
    },
  });

  const acceptCall = trpc.calls.accept.useMutation({
    onSuccess({ startUrl, call }) {
      window.open(call.link ?? startUrl, "_blank");
    },
  });

  return (
    <div
      key={`call-${call.callerEmail}`}
      className="border border-neutral-200 rounded-md flex flex-col space-y-4 p-4 col-span-1 bg-white"
    >
      <div className="w-full flex items-center justify-between">
        <p className="text-base font-medium">
          {call.callerName} wants to have a call.
        </p>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>
      {call.countryCode && (
        <p className="text-sm text-neutral-400">
          Calling from{" "}
          <span className="font-medium">
            {countryNameRecord[call.countryCode as CountryCode]}
          </span>{" "}
          {getCountryFlagEmoji(call.countryCode as CountryCode)}
        </p>
      )}
      <div className="flex flex-col lg:flex-row justify-between w-full space-y-2 lg:space-y-0 lg:space-x-2">
        <Button
          size="sm"
          variant="secondary"
          className="w-full"
          loading={rejectCall.isLoading}
          icon={<PhoneMissed className="h-3 w-3" />}
          disabled={acceptCall.isLoading}
          onClick={() =>
            rejectCall.mutate({
              callId: call.id,
            })
          }
        >
          {rejectCall.isLoading ? "Rejecting" : "Reject"}
        </Button>
        <Button
          size="sm"
          className="w-full"
          loading={acceptCall.isLoading}
          icon={<PhoneCall className="h-3 w-3" />}
          disabled={rejectCall.isLoading}
          onClick={() => tryAcceptCall()}
        >
          {acceptCall.isLoading ? "Connecting" : "Accept"}
        </Button>
      </div>
    </div>
  );
};

export default IncomingCallCard;
