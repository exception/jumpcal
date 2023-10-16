import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  type Day,
  type DayAvailability,
  type Time,
  type TimeSlot,
} from "@/lib/availability";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { capitalize } from "radash";

const isTimeGreater = (time1: Time, time2: Time): boolean => {
  return (
    time1.hour > time2.hour ||
    (time1.hour === time2.hour && time1.minute > time2.minute)
  );
};

const generateTimeArray = (min = 0, timeJump = 15): Time[] => {
  const times: Time[] = [];
  for (let hour = min; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += timeJump) {
      times.push({ hour, minute });
    }
  }
  return times;
};

const rangesCollide = (slots: TimeSlot[]): boolean => {
  const sortedRanges = [...slots].sort(
    (a, b) =>
      a.start.hour * 60 + a.start.minute - (b.start.hour * 60 + b.start.minute),
  );

  for (let i = 0; i < sortedRanges.length - 1; i++) {
    const currentRange = sortedRanges[i];
    const nextRange = sortedRanges[i + 1];

    // If for some reason the ranges are not properly defined, we'll skip this iteration.
    if (!currentRange || !nextRange) continue;

    const endCurrent = currentRange.end.hour * 60 + currentRange.end.minute;
    const startNext = nextRange.start.hour * 60 + nextRange.start.minute;

    if (endCurrent >= startNext) {
      return true;
    }
  }

  return false;
};

const timeToString = (time: Time) =>
  `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(
    2,
    "0",
  )}`;

interface Props extends DayAvailability {
  onDayChange: (changedDay: Day, availability: DayAvailability) => void;
}

const DayAvailabilityRow = ({ day, slots, available, onDayChange }: Props) => {
  const [timeRanges, setTimeRanges] = useState<TimeSlot[]>(slots ?? []);
  const [isAvailable, setIsAvailable] = useState(available);
  const times = generateTimeArray();

  const handleTimeRangeAdd = useCallback(() => {
    if (!isAvailable) {
      setIsAvailable(true);
    }

    const newRange = {
      start: { hour: 9, minute: 0 },
      end: { hour: 17, minute: 0 },
    };
    setTimeRanges([...timeRanges, newRange]);
  }, [isAvailable, timeRanges]);

  useEffect(() => {
    if (!rangesCollide(timeRanges)) {
      onDayChange(day, {
        available: isAvailable,
        day,
        slots: timeRanges,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRanges]);

  const handleTimeChange = (
    index: number,
    type: "start" | "end",
    value: string,
  ) => {
    const parts = value.split(":");

    // Ensure that hour and minute always get a value, otherwise default to 0
    const hour = parts[0] ? parseInt(parts[0], 10) : 0;
    const minute = parts[1] ? parseInt(parts[1], 10) : 0;

    const updatedRanges = timeRanges.map((range, idx) => {
      if (idx !== index) {
        return range; // If it's not the one we want to modify, return it as is
      }

      if (type === "start") {
        return { ...range, start: { hour, minute } };
      } else {
        return { ...range, end: { hour, minute } };
      }
    });

    setTimeRanges(updatedRanges);
  };

  const availableChange = (a: boolean) => {
    setIsAvailable(a);
    onDayChange(day, {
      available: a,
      day,
      slots: timeRanges,
    });
  };

  const handleTimeRangeDelete = (indexToDelete: number) => {
    // Filter out the range at the given index.
    const updatedRanges = timeRanges.filter(
      (_, index) => index !== indexToDelete,
    );
    setTimeRanges(updatedRanges);
  };

  return (
    <div
      key={`day-${day}`}
      className={cn(
        "flex w-full flex-row justify-between p-5 bg-white",
        isAvailable && "bg-white",
      )}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center space-x-2">
          <Switch
            checked={isAvailable}
            onCheckedChange={(checked) => availableChange(!!checked)}
          />
          <p className="text-sm font-medium text-neutral-500">
            {capitalize(day.toLowerCase())}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          {isAvailable &&
            timeRanges.map((range, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Select
                  defaultValue={timeToString(range.start)}
                  onValueChange={(e) => handleTimeChange(index, "start", e)}
                >
                  <SelectTrigger className="w-[100px] md:w-[150px]">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 md:max-h-96 overflow-y-scroll">
                    {times.map((time) => (
                      <SelectItem
                        key={timeToString(time)}
                        value={timeToString(time)}
                      >
                        {timeToString(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>-</span>
                <Select
                  defaultValue={timeToString(range.end)}
                  onValueChange={(e) => handleTimeChange(index, "end", e)}
                >
                  <SelectTrigger className="w-[100px] md:w-[150px]">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 md:max-h-96 overflow-y-scroll">
                    {times
                      .filter((time) => isTimeGreater(time, range.start))
                      .map((time) => (
                        <SelectItem
                          key={timeToString(time)}
                          value={timeToString(time)}
                        >
                          {timeToString(time)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-md bg-neutral-100 hover:bg-neutral-50"
                  onClick={() => handleTimeRangeDelete(index)}
                >
                  <Trash2
                    className={cn("h-4 w-4 cursor-pointer text-neutral-400")}
                  />
                </Button>
              </div>
            ))}
          {timeRanges.length > 0 && rangesCollide(timeRanges) && (
            <p className="text-sm text-red-500">This schedule has overlaps.</p>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md bg-neutral-100 hover:bg-neutral-50",
        )}
        onClick={handleTimeRangeAdd}
      >
        <Plus className={cn("h-4 w-4 cursor-pointer text-neutral-400")} />
      </div>
    </div>
  );
};

export default DayAvailabilityRow;
