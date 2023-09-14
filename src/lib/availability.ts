import { type DayAvailability } from "@/server/routes/user-routes";
import { DAYS } from "./constants";

const isUserAvailable = (availability: DayAvailability[]): boolean => {
  const currentTime = new Date();
  const currentDay = DAYS[currentTime.getDay()];

  const todayAvailability = availability.find((av) => av.day === currentDay);
  // If today's availability isn't provided or user isn't marked as available, return false
  if (!todayAvailability || !todayAvailability.available) return false;

  for (const slot of todayAvailability.slots) {
    const startTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      slot.start.hour,
      slot.start.minute,
    );
    const endTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      slot.end.hour,
      slot.end.minute,
    );

    // Check if current time is within the time slot
    if (currentTime >= startTime && currentTime <= endTime) {
      return true;
    }
  }

  return false;
};
