import Link from "next/link";
import SettingsContainer from "../../../settings-container";

const HowToCalCom = () => {
  return (
    <SettingsContainer
      title="Cal.com"
      description="How to integrate Jumpcal with Cal.com"
    >
      <video
        src="https://res.cloudinary.com/dcdsmlpvg/video/upload/f_auto:video,q_auto/v1/_static/cntvf0ahwmjojg0ox01r"
        autoPlay
        muted
        loop
      />
      <p className="text-base font-medium">
        Head to{" "}
        <Link
          href="https://app.cal.com/event-types"
          className="underline underline-offset-4 decoration-dashed"
        >
          Cal.com Event Types
        </Link>{" "}
        and copy the meeting link you want to embed.
      </p>
    </SettingsContainer>
  );
};

export default HowToCalCom;
