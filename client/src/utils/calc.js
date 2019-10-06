import { DateTime } from 'luxon';
import { cloneDeep } from 'lodash';
import { tick } from '../actions/user';

export const sortActivities = (activities, timeZone) => {
  let toDoToday = [];
  let toDoThisWeek = [];
  let notToDoToday = [];

  activities.forEach(activity => {
    if (activity.repeat.length === 1) {
      if (activity.repeat[0]) toDoToday.push(activity);
      else toDoThisWeek.push(activity);
    } else {
      let today = DateTime.fromObject({ zone: timeZone }).weekday % 7;
      if (activity.repeat[today]) toDoToday.push(activity);
      else notToDoToday.push(activity);
    }
  });

  const sortFunc = (a, b) =>
    a.displayProgress / a.displayTarget - b.displayProgress / b.displayTarget;

  toDoToday = toDoToday.sort(sortFunc);
  toDoThisWeek = toDoThisWeek.sort(sortFunc);
  notToDoToday = notToDoToday.sort(sortFunc);

  return [...toDoToday, ...toDoThisWeek, ...notToDoToday];
};

export const calcResetsOnBreaktime = (breaktime, timeZone, created) => {
  let now = DateTime.fromObject({ zone: timeZone });
  breaktime.lastReset = now
    .plus({ days: 1 })
    .startOf('week')
    .minus({ days: 1 }).ts;
  breaktime.nextReset = now
    .plus({ days: 1 })
    .startOf('week')
    .plus({ days: 6 }).ts;
  // breaktime.lastReset = Math.max(
  //   now.startOf('week').minus({ days: weekStartOffset }).ts,
  //   created
  // );
  return breaktime;
};

export const calcActivity = (activity, timeZone, breaktime) => {
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
      let day = now.weekday % 7;
      let repeatWrap = repeat.concat(repeat);
      let i;
      for (i = day + 1; i < repeatWrap.length; i++) {
        if (repeatWrap[i]) break;
      }
      let daysDiff = i - day;
      let nextOnDay = now.startOf('day').plus({ days: daysDiff }).ts;
      let nextWeek = breaktime.nextReset;

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
      let day = (now.weekday % 7) + 7;
      let repeatWrap = repeat.concat(repeat);
      let i;
      for (i = day; i > 0; i--) {
        if (repeatWrap[i]) break;
      }
      let daysDiff = day - i;
      let lastOnDay = now.startOf('day').minus({ days: daysDiff }).ts;
      let thisWeek = breaktime.lastReset;

      return Math.max(lastOnDay, thisWeek);
    }
  };

  const calcBreaktimeProgress = (lastReset, start, end) => {
    let progress = 0;
    for (let i = end.length - 1; i >= 0; i--) {
      if (end[i] < lastReset) break;
      progress += end[i] - Math.max(start[i], lastReset);
    }
    return progress;
  };

  const calcDisplayProgress = (breaktimeProgress, repeat, displayTarget) => {
    const numDays = (() => {
      let weekday = DateTime.fromObject({ zone: timeZone }).weekday % 7;
      if (repeat.length === 1) {
        if (repeat[0]) return weekday;
        else return 0;
      } else {
        return (
          repeat
            .slice(0, weekday + 1)
            .reduce((total, curr) => (total += curr), 0) - 1
        );
      }
    })();

    return breaktimeProgress - displayTarget * numDays;
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

  activity.breaktimeProgress = calcBreaktimeProgress(
    breaktime.lastReset,
    activity.start,
    activity.end
  );
  activity.breaktimeTarget = calcBreaktimeTarget(
    activity.displayTarget,
    activity.repeat
  );
  activity.displayProgress = calcDisplayProgress(
    activity.breaktimeProgress,
    activity.repeat,
    activity.displayTarget
  );
  return activity;
};

export const calcBreaktime = (breaktime, activities) => {
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
    const msDone = activities.reduce(
      (total, activity) =>
        (total += Math.min(
          activity.breaktimeTarget,
          activity.breaktimeProgress
        )),
      0
    );
    const msTotal = activities.reduce(
      (total, activity) => (total += activity.breaktimeTarget),
      0
    );
    const percentDone = msDone / (msTotal || 1);
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
