"use client";

import { CAL_OR_CALENDLY_REGEX } from "@/lib/constants";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface Props {
  calendarLink: string;
}

const CalEmbed = ({ calendarLink }: Props) => {
  const matchResult = calendarLink.match(CAL_OR_CALENDLY_REGEX);
  const calLink = matchResult ? matchResult[1] ?? "" : "";

  useEffect(() => {
    void (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-xl font-medium">Schedule a time via Cal.com</p>
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
};

export default CalEmbed;
