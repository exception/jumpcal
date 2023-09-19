import JumpcalLogoFull from "@/components/ui/icons/jumpcal-logo-full";
import { makeMetadata } from "@/lib/utils";

export const metadata = makeMetadata({
  title: "Jumpcal",
});

const OnboardLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div className="flex flex-col min-h-screen justify-center bg-neutral-50 py-12">
      <div className="mb-auto mx-auto">
        <JumpcalLogoFull />
      </div>
      {children}
    </div>
  );
};

export default OnboardLayout;
