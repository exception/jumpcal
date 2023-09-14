import Image from "next/image";
import CopyProfileLink from "./copy-profile-link";

const CallLogPage = () => {
  return (
    <div className="bg-white border border-neutral-200 flex items-center justify-center flex-col p-4 text-neutral-500">
      <Image
        src={"/_static/svgs/telephone-call.svg"}
        alt="No Integrations"
        width={300}
        height={300}
      />
      <p className="text-base md:text-lg text-center mt-2 mb-4">
        You haven&apos;t received any calls yet, time to share your profile with
        more people!
      </p>
      <CopyProfileLink />
    </div>
  );
};

export default CallLogPage;
