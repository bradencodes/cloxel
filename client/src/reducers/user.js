import { USER_LOADED, CALC_ACTIVITIES, TICK } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        ...payload
      };

    case CALC_ACTIVITIES: {
      return {
        ...state,
        ...payload
      };
    }

    case TICK: {
      return {
        ...state,
        ...payload
      };
    }

    default:
      return state;
  }
}
