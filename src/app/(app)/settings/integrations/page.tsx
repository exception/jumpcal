import SettingsContainer from "../settings-container";
import ZoomIntegration from "./zoom-integration";

const IntegrationSettings = () => {
  return (
    <SettingsContainer
      title="Integrations"
      description="Allow Jumpcal to schedule calls on your behalf."
    >
      <ZoomIntegration />
    </SettingsContainer>
  );
};

export default IntegrationSettings;
