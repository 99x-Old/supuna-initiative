import { SET_PROFILE, UPDATE_PROFILE } from 'constants/action-types';
import { ProfileDefaults, ProfileType } from 'types/profile.type';

const profileReducer: ()=>ProfileType = (state: ProfileType = ProfileDefaults, action = null) => {
  const { data }: array = action;
  switch (action.type) {
    case SET_PROFILE:
      data.age = Math.floor((new Date()
          - new Date(action.data.birth).getTime()) / 3.15576e+10);
      return { ...state, ...data };
    case UPDATE_PROFILE:
      return { ...state, [action.field]: action.data };
    default:
      return state;
  }
};
export default profileReducer;
