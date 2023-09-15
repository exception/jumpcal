"use client";

import { type DayAvailability, isUserAvailable } from "@/lib/availability";
import { useState } from "react";

interface Props {
  dnd?: boolean;
  availability: DayAvailability[];
  timezone: string;
}

const ChatCard = ({ dnd, availability, timezone }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const available = isUserAvailable(availability, timezone);

  return <>{JSON.stringify(available)}</>;
};

export default ChatCard;
