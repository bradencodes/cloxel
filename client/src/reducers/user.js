import { USER_LOADED } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        ...payload
      };

    // case CALC_ACTIVITIES: {
    //   let activities = [...state.activities];

    // }

    default:
      return state;
  }
};
