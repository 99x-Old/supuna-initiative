import type { SettingInterface } from './setting.interface';

export default class SettingService {
  settings: Array<SettingInterface> = [];

  /**
   *
   * @param {SettingInterface} setting
   */
  addSetting(setting: SettingInterface) {
    this.settings.push(setting);
  }

  /**
   *
   * @return {Promise<void>}
   */
  async process() {
    for (const settingItem: SettingInterface of this.settings) {
      await settingItem.process().then((data) => {});
    }
  }

  /**
   *
   * @return {Promise<{}>}
   */
  async get() {
    const data = {};
    for (const settingItem: SettingInterface of this.settings) {
      await settingItem.get().then((response) => {
        data[settingItem.getName()] = response;
      });
    }
    return data;
  }
}
