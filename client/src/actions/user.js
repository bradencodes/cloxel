import axios from 'axios';
import { UPDATE_USER } from './types';
import { DateTime } from 'luxon';

const urlpre = process.env.REACT_APP_API_URL;

const weekStartOffset = 1; //start the week at Monday-weekStartOffset

export const calcActivities = inputUser => dispatch => {
  let user = { ...inputUser };
  let { activities, timeZone, breaktime } = user;
  breaktime = calcResetsOnBreaktime(breaktime, timeZone);
  activities = activities.map(activity =>
    calcActivity(activity, timeZone, breaktime)
  );
  breaktime = calcBreaktime(breaktime, activities);
  dispatch({ type: UPDATE_USER, payload: user });
};

export const tick = inputUser => dispatch => {
  let user = { ...inputUser };
  const userIsEmpty =
    Object.keys(user).length === 0 && user.constructor === Object;
  if (userIsEmpty) return;

  const now = Date.now();
  let { activities, breaktime, active } = user;
  const breaktimeIsActive = active === breaktime._id;

  // update active.end[active.end.length-1] to date.now
  if (breaktimeIsActive) {
    if (breaktime.end.length < breaktime.start.length) breaktime.end.push(now);
    else breaktime.end[breaktime.end.length - 1] = now;
  } else {
    let activeActivity = activities.find(activity => activity.id === active);
    if (activeActivity.end.length < activeActivity.start.length)
      activeActivity.end.push(now);
    else activeActivity.end[activeActivity.end.length - 1] = now;
  }

  // check if date.now is past nextRest of any activities
  const breaktimeIsPastReset = breaktime.nextReset < now;
  const someActivityIsPastReset = [...activities].some(
    activity => activity.nextDisplayReset < now
  );
  if (breaktimeIsPastReset || someActivityIsPastReset) {
    calcActivities(user);
  } else {
    dispatch({ type: UPDATE_USER, payload: user });
  }
};

// ======= Helper Functions =======

const calcResetsOnBreaktime = (breaktime, timeZone) => {
  let now = DateTime.fromObject({ zone: timeZone });
  breaktime.nextReset = now.startOf('week').plus({ days: 7 - weekStartOffset });
  breaktime.lastReset = now.startOf('week').minus({ days: weekStartOffset });
  return breaktime;
};

const calcActivity = (activity, timeZone, breaktime) => {
  let now = DateTime.fromObject({ zone: timeZone });

  const calcNextDisplayReset = repeat => {
    //if it repeats weekly or daily
    if (repeat.length === 1) {
      // return the start of the next day
      if (repeat[0]) return now.startOf('day').plus({ days: 1 });
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
      let nextOnDay = now.startOf('day').plus({ days: daysDiff });
      let nextWeek = now.startOf('week').plus({ days: 7 - weekStartOffset });

      return nextOnDay.ts < nextWeek.ts ? nextOnDay : nextWeek;
    }
  };

  const calcLastDisplayReset = repeat => {
    //if it repeats weekly or daily
    if (repeat.length === 1) {
      // return the start of today
      if (repeat[0]) return now.startOf('day');
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
      let lastOnDay = now.startOf('day').minus({ days: daysDiff });
      let thisWeek = now.startOf('week').minus({ days: weekStartOffset });

      return lastOnDay.ts > thisWeek.ts ? lastOnDay : thisWeek;
    }
  };

  const calcProgress = (lastReset, start, end) => {
    let progress = 0;
    for (let i = end.length - 1; i >= 0; i--) {
      if (end[i] < lastReset.ts) break;
      progress += end[i] - Math.max(start[i], lastReset.ts);
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
      if (end[i] < lastReset.ts) break;
      progress += end[i] - Math.max(start[i], lastReset.ts);
    }
    return progress;
  };

  const calcTarget = (nextReset, lastReset, activities) => {
    const extraTime = activities.reduce(
      (total, activity) =>
        (total += Math.max(
          activity.breaktimeTarget,
          activity.breaktimeProgress
        )),
      0
    );
    return nextReset - lastReset - extraTime;
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
