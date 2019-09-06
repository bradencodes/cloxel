import { SET_ALERTS } from './types';

export const setAlerts = (obj) => dispatch => {
  dispatch({
    type: SET_ALERTS,
    payload: obj
  });
};
