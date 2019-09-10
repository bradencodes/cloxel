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

    default:
      return state;
  }
}
