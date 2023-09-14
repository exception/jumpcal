import { ArchiveX, Loader2, PhoneIncoming } from "lucide-react";
import IncomingCallCard from "./incoming-call-card";
import { trpc } from "@/lib/providers/trpc-provider";
import { Skeleton } from "@/components/ui/skeleton";

const IncomingCalls = () => {
  const {
    data: incomingCalls,
    isInitialLoading,
    isRefetching,
  } = trpc.calls.incomingCalls.useQuery(undefined, {
    refetchInterval: 3_000, // 3 seconds
    refetchIntervalInBackground: true,
    retry: true,
    retryDelay: (attempt) => attempt * 1000,
  });

  if (isInitialLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!incomingCalls || incomingCalls?.length === 0) {
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
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 items-center">
          <PhoneIncoming className="h-4 w-4" />
          <h3 className="text-xl font-medium">Incoming Calls</h3>
        </div>
        {isRefetching && <Loader2 className="h-6 w-6 animate-spin" />}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {incomingCalls?.map((call) => (
          <IncomingCallCard key={`call-${call.callerEmail}`} call={call} />
        ))}
      </div>
    </div>
  );
};

export default IncomingCalls;
