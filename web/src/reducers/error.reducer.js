import { SET_ERROR } from 'constants/action-types';

const errorReducer = (state: array = {}, action: any = null) => {
  switch (action.type) {
    case SET_ERROR:
      return action.data;
    default:
      return state;
  }
};
export default errorReducer;
