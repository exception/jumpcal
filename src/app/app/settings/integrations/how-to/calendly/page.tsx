import Link from "next/link";
import SettingsContainer from "../../../settings-container";

const HowToCalendly = () => {
  return (
    <SettingsContainer
      title="Calendly"
      description="How to integrate Jumpcal with Calendly.com"
    >
      <video
        src="https://res.cloudinary.com/dcdsmlpvg/video/upload/f_auto:video,q_auto/v1/_static/z4zqonfg7wpr9sfspsr6"
        autoPlay
        muted
        loop
      />
      <p className="text-base font-medium">
        Head to{" "}
        <Link
          href="https://calendly.com/event_types/user/me"
          className="underline underline-offset-4 decoration-dashed"
        >
          Calendly Event Types
        </Link>{" "}
        and copy the meeting link you want to embed.
      </p>
    </SettingsContainer>
  );
};

export default HowToCalendly;
