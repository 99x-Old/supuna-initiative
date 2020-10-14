import type { AuthType } from './auth.type';
import type { ProfileType } from './profile.type';

export type StoreType = {
  auth: AuthType,
  profile: ProfileType,
  settings: any,
  error: any,
  messageStatus: any,
  notificationStatus: any,
  popup: any
};
