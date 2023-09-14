import { makeMetadata } from "@/lib/utils";
import SettingsContainer from "../settings-container";
import AvailabilityContent from "./form";

export const metadata = makeMetadata({
  title: "Jumpcal - Availability Settings",
});

const AvailabilitySettings = () => {
  return (
    <SettingsContainer
      title="Availability"
      description="Customize when you can receive calls."
    >
      <AvailabilityContent />
    </SettingsContainer>
  );
};

export default AvailabilitySettings;
