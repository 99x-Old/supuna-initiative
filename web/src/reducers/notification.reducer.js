import { SET_NOTIFICATION_STATUS } from 'constants/action-types';

const notificationStatusReducer: () => void = (state: any = {}, action = null) => {
  switch (action.type) {
    case SET_NOTIFICATION_STATUS:
      return action.data;
    default:
      return state;
  }
};
export default notificationStatusReducer;
