import type { UserMiniType } from 'type/user.type';

export interface SettingInterface {
  setSetting(setting: any): void,

  setName(setting: any): void,

  getName(): string,

  process(): Promise<void>,

  get(): Promise<void>,

  setUser(user: UserMiniType): void
}
