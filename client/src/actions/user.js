import { cloneDeep } from 'lodash';
import { UPDATE_USER } from './types';
import { calcActivities, calcBreaktime, calcActivity } from '../utils/calc';

export const changeDoing = (
  inputUser,
  doNowId,
  wasDoingId,
  time
) => async dispatch => {
  let user = cloneDeep(inputUser);
  let doNow = [...user.activities, user.breaktime].find(
    activity => activity._id === doNowId
  );
  let wasDoing = [...user.activities, user.breaktime].find(
    activity => activity._id === wasDoingId
  );
  try {
    doNow.start.push(time);

    wasDoing.end.pop();
    wasDoing.end.push(time);

    user.active = doNowId;
    dispatch(tick(user));
  } catch (err) {
    console.log(err);
  }
};

export const tick = inputUser => dispatch => {
  let user = cloneDeep(inputUser);
  const userIsEmpty =
    Object.keys(user).length === 0 && user.constructor === Object;
  if (userIsEmpty) return;

  const now = Date.now();
  let { activities, breaktime, active } = user;
  const breaktimeIsActive = active === breaktime._id;
  let activeActivity;

  // update active.end[active.end.length-1] to date.now
  if (breaktimeIsActive) {
    if (breaktime.end.length < breaktime.start.length) breaktime.end.push(now);
    else {
      breaktime.end.pop();
      breaktime.end.push(now);
    }
  } else {
    activeActivity = activities.find(activity => activity._id === active);
    if (activeActivity.end.length < activeActivity.start.length)
      activeActivity.end.push(now);
    else {
      activeActivity.end.pop();
      activeActivity.end.push(now);
    }
  }

  // check if date.now is past nextReset of any activities
  const breaktimeIsPastReset = breaktime.nextReset < now;
  const someActivityIsPastReset = [...activities].some(
    activity => activity.nextDisplayReset < now
  );
  if (breaktimeIsPastReset || someActivityIsPastReset) {
    dispatch(calcActivities(user));
  } else if (breaktimeIsActive) {
    breaktime = calcBreaktime(breaktime, activities);
    dispatch({ type: UPDATE_USER, payload: user });
  } else {
    activeActivity = calcActivity(activeActivity, user.timeZone, breaktime);
    breaktime = calcBreaktime(breaktime, activities);
    dispatch({ type: UPDATE_USER, payload: user });
  }
};

// ======= Helper Functions =======
