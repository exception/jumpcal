import { makeMetadata } from "@/lib/utils";

export const metadata = makeMetadata({
  title: "Jumpcal - Integration Settings",
});

const IntegrationLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return <>{children}</>;
};

export default IntegrationLayout;
