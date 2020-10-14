import type { SettingInterface } from '../setting.interface';
import type { PrivacySettingInterface } from './privacy.setting.interface';
import BaseSettings from '../base.settings';

export default class WhoCanConnectSetting extends BaseSettings
  implements SettingInterface, PrivacySettingInterface {
  constructor() {
    super();
    this.setting = {
      country: [],
      age: {
        from: 13,
        to: 100,
      },
      gender: [],
      blocked_country: [],
    };
  }
}
