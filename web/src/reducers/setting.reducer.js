import { SET_SETTINGS, UPDATE_SETTINGS } from 'constants/action-types';

const settingsReducer = (state: array = {}, action: any = null) => {
  switch (action.type) {
    case SET_SETTINGS:
      return { ...state, ...action.data };
    case UPDATE_SETTINGS:
      return { ...state, [action.field]: action.data };
    default:
      return state;
  }
};
export default settingsReducer;
