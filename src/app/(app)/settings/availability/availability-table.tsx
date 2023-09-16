"use client";

import { trpc } from "@/lib/providers/trpc-provider";
import DayAvailabilityRow from "./day-availability-row";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useEffect, useState } from "react";
import { type Day, type DayAvailability } from "@/lib/availability";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AvailabilityTable = () => {
  const { data, isLoading, refetch } = trpc.users.availability.useQuery();
  const { toast } = useToast();
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [changed, setChanged] = useState(false);
  const updateAvailability = trpc.users.updateAvailability.useMutation({
    async onSuccess() {
      await refetch();
      toast({
        title: "Availability saved",
        description: "Successfully saved your availability",
      });
    },
    onError() {
      toast({
        title: "Something went wrong",
        description:
          "Failed to save your availability, please try again later.",
      });
    },
  });

  useEffect(() => {
    if (data) {
      setAvailability(data);
    }
  }, [data]);

  const handleDayChange = (
    changedDay: Day,
    newAvailability: DayAvailability,
  ) => {
    setChanged(true);
    const updatedAvailability = availability.map((dayAvailability) => {
      if (dayAvailability.day === changedDay) {
        return newAvailability;
      }
      return dayAvailability;
    });

    setAvailability(updatedAvailability);
  };

  if (isLoading) {
    return <Skeleton className="flex mt-4 w-full h-96" />;
  }

  return (
    <div className="flex w-full flex-col py-2">
      <h5 className="text-sm font-medium text-neutrals-500 mb-2">
        Weekly Schedule
      </h5>
      <Suspense fallback={<Skeleton className="flex h-96 w-full" />}>
        <>
          <div className="w-full divide-y divide-neutrals-100 overflow-hidden rounded-lg border border-neutrals-100 bg-neutrals-50">
            {availability.map((day) => (
              <DayAvailabilityRow
                day={day.day}
                available={day.available}
                slots={day.slots}
                key={`day-${day.day}`}
                onDayChange={handleDayChange}
              />
            ))}
          </div>
          <Button
            icon={<Save className="h-4 w-4" />}
            className="self-start mt-2"
            disabled={!availability || !changed}
            loading={updateAvailability.isLoading}
            onClick={() =>
              updateAvailability.mutate({
                availability,
              })
            }
          >
            Save
          </Button>
        </>
      </Suspense>
    </div>
  );
};

export default AvailabilityTable;
