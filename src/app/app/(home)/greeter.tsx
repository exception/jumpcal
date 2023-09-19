"use client";

import { useMemo } from "react";

const Greeter = () => {
  const currentDate = useMemo(() => new Date(), []);
  const toShow = useMemo(() => {
    const hour = currentDate.getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }, [currentDate]);

  return (
    <h1 className="text-lg lg:text-2xl font-semibold text-neutrals-500">
      {toShow} 👋
    </h1>
  );
};

export default Greeter;
