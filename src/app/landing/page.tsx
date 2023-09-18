import MaxWidthContainer from "@/components/app/max-width-container";

const LandingPage = () => {
  return (
    <MaxWidthContainer className="mt-10">
      <div className="flex flex-col space-x-5 justify-between">
        <div className="flex flex-row space-y-2 shrink-0 w-full">
          <h1 className="text-3xl font-medium">
            Add instant meetings to your calendar scheduling, instantly.
          </h1>
        </div>
        <div className="flex w-full shrink-0"></div>
      </div>
    </MaxWidthContainer>
  );
};

export default LandingPage;
