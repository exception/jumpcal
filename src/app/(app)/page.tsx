import MaxWidthContainer from "@/components/app/max-width-container";
import Greeter from "./greeter";
import DoNotDisturbToggle from "./do-not-disturb-toggle";
import RootContainer from "./root-container";

const RootPage = () => {
  return (
    <>
      <div className="py-4 bg-white border-b border-b-neutral-200">
        <MaxWidthContainer className="flex justify-between items-center">
          <Greeter />
          <DoNotDisturbToggle />
        </MaxWidthContainer>
      </div>
      <MaxWidthContainer className="mt-4">
        <RootContainer />
      </MaxWidthContainer>
    </>
  );
};

export default RootPage;
