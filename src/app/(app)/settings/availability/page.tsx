import { makeMetadata } from "@/lib/utils";
import SettingsContainer from "../settings-container";
import AvailabilityContent from "./form";
import GoogleCalendarAlert from "./google-calendar-alert";

export const metadata = makeMetadata({
  title: "Jumpcal - Availability Settings",
});

const AvailabilitySettings = () => {
  return (
    <SettingsContainer
      title="Availability"
      description="Customize when you can receive calls."
    >
      <GoogleCalendarAlert />
      <AvailabilityContent />
    </SettingsContainer>
  );
};

export default AvailabilitySettings;
