import { SET_ALERTS } from './types';

export const setAlerts = (obj) => dispatch => {
  console.log('setAlerts triggered');
  dispatch({
    type: SET_ALERTS,
    payload: obj
  });
};
