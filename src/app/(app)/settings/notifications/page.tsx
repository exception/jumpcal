import SettingsContainer from "../settings-container";
import SmsNotification from "./sms-notification";

const NotificationSettings = () => {
  return (
    <SettingsContainer
      title="Notifications"
      description="How Jumpcal will notify you about incoming calls."
    >
      <SmsNotification />
    </SettingsContainer>
  );
};

export default NotificationSettings;
