import AppLayout from "@/components/app/app-layout";

const RootLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return <AppLayout>{children}</AppLayout>;
};

export default RootLayout;
