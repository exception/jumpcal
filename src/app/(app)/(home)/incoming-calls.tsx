import { Loader2 } from "lucide-react";
import IncomingCallCard from "./incoming-call-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIncomingCalls } from "@/lib/providers/incoming-calls-provider";
import Image from "next/image";

const IncomingCalls = () => {
  const { calls, isInitialLoading, isRefetching } = useIncomingCalls();

  if (isInitialLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!calls || calls?.length === 0) {
    return (
      <div className="relative border border-neutral-200 rounded-md flex flex-col items-center justify-center text-neutral-500 bg-white p-4">
        {isRefetching && (
          <Loader2 className="absolute top-2 right-2 text-neutral-500 h-6 w-6 animate-spin" />
        )}
        <Image
          src="/_static/svgs/digital-nomad.svg"
          alt="No Incoming Calls"
          width={300}
          height={300}
        />
        <p className="text-base md:text-lg mt-2 text-center">
          There are no incoming calls, you can take some time to relax!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {calls?.map((call) => (
          <IncomingCallCard key={`call-${call.callerEmail}`} call={call} />
        ))}
      </div>
    </div>
  );
};

export default IncomingCalls;
