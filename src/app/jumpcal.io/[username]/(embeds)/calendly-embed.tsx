"use client";

import { InlineWidget } from "react-calendly";

interface Props {
  calendarLink: string;
}

const CalendlyEmbed = ({ calendarLink }: Props) => {
  return (
    <div className="space-y-4">
      <p className="text-xl font-medium">Schedule a time via Calendly</p>
      <InlineWidget
        pageSettings={{
          hideGdprBanner: true,
        }}
        url={calendarLink}
      />
    </div>
  );
};

export default CalendlyEmbed;
