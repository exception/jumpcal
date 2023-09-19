import { Separator } from "@/components/ui/separator";

interface Props {
  title: string;
  description: string;
}

const SettingsContainer = ({
  title,
  description,
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <div className="space-y-4 w-full">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>
      <Separator className="w-full" />
      {children}
    </div>
  );
};

export default SettingsContainer;
