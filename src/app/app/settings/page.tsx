import { makeMetadata } from "@/lib/utils";
import AccountSettingsForm from "./form";
import SettingsContainer from "./settings-container";
import UploadAvatarRow from "./upload-avatar";
import LayoutSettings from "./layout-settings";

export const metadata = makeMetadata({
  title: "Jumpcal - Account Settings",
});

const AccountSettings = () => {
  return (
    <SettingsContainer
      title="Account"
      description="This is how you will appear to the world."
    >
      <UploadAvatarRow />
      <AccountSettingsForm />
      <LayoutSettings />
    </SettingsContainer>
  );
};

export default AccountSettings;
