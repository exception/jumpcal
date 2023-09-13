import { Button } from "@/components/ui/button";
import {
  CountryCode,
  countryNameRecord,
  getCountryFlagEmoji,
} from "@/lib/constants";
import { Call } from "@prisma/client";
import { ArchiveX, PhoneCall, PhoneIncoming, PhoneMissed } from "lucide-react";
import IncomingCallCard from "./incoming-call-card";

const IncomingCalls = () => {
  const calls: Pick<
    Call,
    "countryCode" | "callerEmail" | "callerName" | "callerReason"
  >[] = [
    {
      countryCode: "AR",
      callerName: "Erik",
      callerEmail: "erik@erosemberg.com",
      callerReason: "I wanna chat",
    },
  ];

  if (calls.length === 0) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2 items-center">
          <PhoneIncoming className="h-4 w-4" />
          <h3 className="text-xl font-medium">Incoming Calls</h3>
        </div>

        <div className="border border-neutral-200 rounded-md flex flex-col space-y-2 items-center justify-center text-neutral-400 bg-white p-4">
          <ArchiveX className="h-6 w-6" />
          <p className="text-lg">There are no incoming calls.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {calls.map((call) => (
        <IncomingCallCard key={`call-${call.callerEmail}`} call={call} />
      ))}
    </div>
  );
};

export default IncomingCalls;
