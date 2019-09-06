import { SET_ALERTS } from '../actions/types';

const initialState = {
  errors: [],
  warnings: [],
  successes: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERTS:
      console.log(`payload = ${payload}`);
      return { ...state, ...payload };

    default:
      return state;
  }
}
