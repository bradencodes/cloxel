import { cloneDeep } from 'lodash';
import { UPDATE_USER } from './types';
import { DateTime } from 'luxon';

export const changeDoing = (
  inputUser,
  doNowId,
  wasDoingId,
  time
) => async dispatch => {
  console.log('changeDoing triggered')
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

const weekStartOffset = 1; //start the week at Monday-weekStartOffset

export const calcActivities = inputUser => dispatch => {
  let user = cloneDeep(inputUser);
  let { activities, timeZone, breaktime, created } = user;
  breaktime = calcResetsOnBreaktime(breaktime, timeZone, created);
  activities = activities.map(activity =>
    calcActivity(activity, timeZone, breaktime)
  );
  breaktime = calcBreaktime(breaktime, activities);
  dispatch(tick(user));
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

const calcResetsOnBreaktime = (breaktime, timeZone, created) => {
  let now = DateTime.fromObject({ zone: timeZone });
  breaktime.nextReset = now
    .startOf('week')
    .plus({ days: 7 - weekStartOffset }).ts;
  // breaktime.lastReset = Math.max(
  //   now.startOf('week').minus({ days: weekStartOffset }).ts,
  //   created
  // );
  breaktime.lastReset = now.startOf('week').minus({ days: weekStartOffset }).ts;
  return breaktime;
};

const calcActivity = (activity, timeZone, breaktime) => {
  let now = DateTime.fromObject({ zone: timeZone });

  const calcNextDisplayReset = repeat => {
    //if it repeats weekly or daily
    if (repeat.length === 1) {
      // return the start of the next day
      if (repeat[0]) return now.startOf('day').plus({ days: 1 }).ts;
      // return the start of the next week
      else return breaktime.nextReset;
    } else {
      // return the start of Math.min(the next onDay, the next week)
      let day = now.weekday - 1;
      let repeatWrap = repeat.concat(repeat);
      let i;
      for (i = day + 1; i < repeatWrap.length; i++) {
        if (repeatWrap[i]) break;
      }
      let daysDiff = i - day;
      let nextOnDay = now.startOf('day').plus({ days: daysDiff }).ts;
      let nextWeek = now.startOf('week').plus({ days: 7 - weekStartOffset }).ts;

      return Math.min(nextOnDay, nextWeek);
    }
  };

  const calcLastDisplayReset = repeat => {
    //if it repeats weekly or daily
    if (repeat.length === 1) {
      // return the start of today
      if (repeat[0]) return now.startOf('day').ts;
      // return the start of this week
      else return breaktime.lastReset;
    } else {
      // return the start of Math.max(the last onDay, this week)
      let day = now.weekday - 1 + 7;
      let repeatWrap = repeat.concat(repeat);
      let i;
      for (i = day; i > 0; i--) {
        if (repeatWrap[i]) break;
      }
      let daysDiff = day - i;
      let lastOnDay = now.startOf('day').minus({ days: daysDiff }).ts;
      let thisWeek = now.startOf('week').minus({ days: weekStartOffset }).ts;

      return Math.max(lastOnDay, thisWeek);
    }
  };

  const calcProgress = (lastReset, start, end) => {
    let progress = 0;
    for (let i = end.length - 1; i >= 0; i--) {
      if (end[i] < lastReset) break;
      progress += end[i] - Math.max(start[i], lastReset);
    }
    return progress;
  };

  const calcBreaktimeTarget = (displayTarget, repeat) => {
    if (repeat.length === 1) {
      if (repeat[0]) return displayTarget * 7;
      else return displayTarget;
    } else {
      return displayTarget * repeat.reduce((total, curr) => (total += curr), 0);
    }
  };

  activity.nextDisplayReset = calcNextDisplayReset(activity.repeat);
  activity.lastDisplayReset = calcLastDisplayReset(activity.repeat);
  activity.displayProgress = calcProgress(
    activity.lastDisplayReset,
    activity.start,
    activity.end
  );
  activity.breaktimeProgress = calcProgress(
    breaktime.lastReset,
    activity.start,
    activity.end
  );
  activity.breaktimeTarget = calcBreaktimeTarget(
    activity.displayTarget,
    activity.repeat
  );
  return activity;
};

const calcBreaktime = (breaktime, activities) => {
  const calcProgress = (lastReset, start, end) => {
    let progress = 0;
    for (let i = end.length - 1; i >= 0; i--) {
      if (end[i] < lastReset) break;
      progress += end[i] - Math.max(start[i], lastReset);
    }
    return progress;
  };

  const calcTarget = (nextReset, lastReset, activities) => {
    const plannedTime = activities.reduce(
      (total, activity) =>
        (total += Math.max(
          activity.breaktimeTarget,
          activity.breaktimeProgress
        )),
      0
    );
    return nextReset - lastReset - plannedTime;
  };

  const calcEarned = (target, activities) => {
    const percentDone = activities.reduce(
      (total, activity) =>
        (total +=
          Math.min(activity.breaktimeTarget, activity.breaktimeProgress) /
          activity.breaktimeTarget),
      0
    );
    return Math.round(target * percentDone);
  };

  breaktime.used = calcProgress(
    breaktime.lastReset,
    breaktime.start,
    breaktime.end
  );
  breaktime.target = calcTarget(
    breaktime.nextReset,
    breaktime.lastReset,
    activities
  );
  const addsActivities = activities.filter(activity => activity.adds);
  breaktime.earned = calcEarned(breaktime.target, addsActivities);

  return breaktime;
};
