import { calcActivity } from '../utils/calc';
import { UPDATE_USER } from './types';
import { cloneDeep } from 'lodash';

export const addActivityToRedux = (activity, inputUser) => dispatch => {
  let user = cloneDeep(inputUser);
  activity = calcActivity(activity, user.timeZone, user.breaktime);
  user.activities.push(activity);
  dispatch({ type: UPDATE_USER, payload: user });
};
