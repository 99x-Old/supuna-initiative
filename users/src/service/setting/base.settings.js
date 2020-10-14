import { type UserMiniType } from 'type/user.type';
import SettingRepository from 'repository/setting.repository';

export default class BaseSettings {
  user: UserMiniType = {};

  setting: any = {};

  name: string = null;

  repository: SettingRepository = {};

  constructor() {
    this.repository = new SettingRepository();
  }

  async process(): Promise<void> {
    return this.repository.setSetting(this.user.id, this.name, this.setting);
  }

  async get(): Promise<object> {
    return this.repository
      .getSetting(this.user.id, this.name)
      .then((setting) => (setting ? setting.settings : this.setting));
  }

  setSetting(setting: any): void {
    this.setting = setting;
  }

  setName(setting: any): void {
    this.name = setting;
  }

  getName(): string {
    return this.name;
  }

  setUser(user: UserMiniType) {
    this.user = user;
  }
}
