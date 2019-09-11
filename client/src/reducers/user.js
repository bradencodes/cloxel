import { UPDATE_USER } from '../actions/types';

const initialState = {};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_USER:
      return {
        ...state,
        ...payload
      };

    default:
      return state;
  }
}
