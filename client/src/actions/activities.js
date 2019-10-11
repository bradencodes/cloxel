import { calcActivity } from '../utils/calc';
import { UPDATE_USER } from './types';
import { cloneDeep } from 'lodash';

export const addActivityToRedux = (activity, inputUser) => dispatch => {
  let user = cloneDeep(inputUser);
  activity = calcActivity(activity, user.timeZone, user.breaktime);
  user.activities.push(activity);
  dispatch({ type: UPDATE_USER, payload: user });
};

export const editActivityInRedux = (activity, inputUser) => dispatch => {
  let user = cloneDeep(inputUser);
  activity = calcActivity(activity, user.timeZone, user.breaktime);
  let oldActivity = user.activities.find(oldActivity => oldActivity._id === activity._id);
  let oldActivityIndex = user.activities.indexOf(oldActivity);
  user.activities[oldActivityIndex] = activity;
  dispatch({ type: UPDATE_USER, payload: user });
};

export const removeActivityInRedux = (activity, inputUser, time) => dispatch => {
  let user = cloneDeep(inputUser);
  user.activities = user.activities.filter(notDeleted => notDeleted._id !== activity._id);
  user.deletedActivities.push(activity._id);
  activity.removed.push(time);
  dispatch({ type: UPDATE_USER, payload: user });
};
