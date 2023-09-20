import MarketingNavigation from "./navigation";

const LandingLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div className={"min-h-screen w-full bg-neutral-50"}>
      <MarketingNavigation />
      {children}
    </div>
  );
};

export default LandingLayout;
