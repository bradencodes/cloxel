import { USER_LOADED, CALC_ACTIVITIES } from '../actions/types';
import { DateTime } from 'luxon';

const initialState = {};

const weekStartOffset = 1; //start the week at Monday-weekStartOffset

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

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        ...payload
      };

    case CALC_ACTIVITIES: {
      let { activities, timeZone, breaktime } = state;
      breaktime = calcResetsOnBreaktime(breaktime, timeZone);
      activities = activities.map(activity =>
        calcActivity(activity, timeZone, breaktime)
      );
      console.log(activities);
      return {
        ...state,
        activities
      };
    }

    default:
      return state;
  }
}
