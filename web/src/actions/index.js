import {
  SET_AUTH,
  SET_PROFILE,
  SET_SETTINGS,
  UPDATE_PROFILE,
  UPDATE_SETTINGS,
  SET_ERROR,
  SET_NOTIFICATION_STATUS,
  SET_POPUP,
} from 'constants/action-types';
import type { AuthType } from 'types/auth.type';
import type { ProfileType } from 'types/profile.type';

export const setAuth = (data: AuthType) => ({ type: SET_AUTH, data });
export const setProfile = (data: ProfileType) => ({ type: SET_PROFILE, data });
export const updateProfile = (data: any, field: string) => ({ type: UPDATE_PROFILE, data, field });
export const setSettings = (data: any) => ({ type: SET_SETTINGS, data });
export const setNotificationStatus = (data: any) => ({ type: SET_NOTIFICATION_STATUS, data });
export const setPopup = (data: any) => ({ type: SET_POPUP, data });

export const updateSettings = (
  data: any,
  field: string,
) => ({ type: UPDATE_SETTINGS, data, field });

export const setError = (data: any) => ({ type: SET_ERROR, data });
