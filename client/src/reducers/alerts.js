import { SET_ALERTS, CLEAR_ALERTS } from '../actions/types';

const initialState = {
  errors: [],
  warnings: [],
  successes: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERTS:
      return { ...state, ...payload };

    case CLEAR_ALERTS:
      return initialState;

    default:
      return state;
  }
}
