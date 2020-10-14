import { SET_POPUP } from 'constants/action-types';

const errorReducer = (state: array = {}, action: any = null) => {
  switch (action.type) {
    case SET_POPUP:
      return action.data;
    default:
      return state;
  }
};
export default errorReducer;
