import { makeMetadata } from "@/lib/utils";
import AccountSettingsForm from "./form";
import SettingsContainer from "./settings-container";
import UploadAvatarRow from "./upload-avatar";

export const metadata = makeMetadata({
  title: "Jumpcal - Account Settings",
});

const AccountSettings = () => {
  return (
    <SettingsContainer
      title="Account"
      description="This is how you'll appear to the world."
    >
      <UploadAvatarRow />
      <AccountSettingsForm />
    </SettingsContainer>
  );
};

export default AccountSettings;
