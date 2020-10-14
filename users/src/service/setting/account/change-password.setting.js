import type { SettingInterface } from 'service/setting/setting.interface';
import BaseSettings from 'service/setting/base.settings';
import Error from 'error/user.error';
import type { AccountSettingInterface } from './account.setting.interface';

export default class ChangePasswordSetting extends BaseSettings
  implements SettingInterface, AccountSettingInterface {
  async process(): Promise<void> {
    return this.repository
      .verifyPassword(this.user.id, this.setting.current_password)
      .then((valid) => {
        if (valid) {
          return this.repository.setPassword(
            this.user.id,
            this.setting.new_password,
          );
        }
        throw new Error('Invalid current password!');
      });
  }
}
