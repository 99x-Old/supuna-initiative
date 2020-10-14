import { combineReducers } from 'redux';
import authReducer from './auth-status.reducer';
import profileReducer from './profile.reducer';
import settingsReducer from './setting.reducer';
import errorReducer from './error.reducer';
import popupReducer from './popup.reducer';
import notificationStatusReducer from './notification.reducer';

const reducers = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  settings: settingsReducer,
  error: errorReducer,
  notificationStatus: notificationStatusReducer,
  popup: popupReducer,
});

export default reducers;
