import { SET_AUTH } from 'constants/action-types';
import localStore from 'store2';
import { AuthDefaults, AuthType } from 'types/auth.type';

const authStatusReducer: () => void = (state: AuthType = AuthDefaults, action = null) => {
  switch (action.type) {
    case SET_AUTH:
      localStore('auth', action.data);
      return action.data;
    default:
      return state;
  }
};
export default authStatusReducer;
