import { cn } from "@/lib/utils";
import MaxWidthContainer from "./max-width-container";
import Link from "next/link";
import JumpcalLogoFull from "../ui/icons/jumpcal-logo-full";
import UserDropdown from "./user-dropdown";

interface Props {
  className?: string;
}

const AppLayout = ({ className, children }: React.PropsWithChildren<Props>) => {
  return (
    <div className={cn("min-h-screen w-full bg-neutral-50", className)}>
      <div className="sticky left-0 right-0 top-0 z-20 border-b border-neutral-200 bg-white">
        <MaxWidthContainer>
          <div className="flex justify-between items-center h-16">
            <div>
              <Link href={"/"}>
                <JumpcalLogoFull className="active:scale-95 transition-all" />
              </Link>
            </div>
            <UserDropdown />
          </div>
        </MaxWidthContainer>
      </div>
      {children}
    </div>
  );
};

export default AppLayout;
