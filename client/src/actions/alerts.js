import { SET_ALERTS, CLEAR_ALERTS } from './types';

export const setAlerts = obj => dispatch => {
  dispatch({
    type: SET_ALERTS,
    payload: obj
  });
};

export const clearAlerts = () => dispatch => {
  dispatch({ type: CLEAR_ALERTS });
};
