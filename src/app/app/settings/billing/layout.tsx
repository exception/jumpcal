import { makeMetadata } from "@/lib/utils";

export const metadata = makeMetadata({
  title: "Jumpcal - Billing Settings",
});

const BillingLayout = ({ children }: React.PropsWithChildren) => {
  return <>{children}</>;
};

export default BillingLayout;
