import { USER_LOADED, CALC_ACTIVITIES } from '../actions/types';
import { DateTime } from 'luxon';

const initialState = {};

const weekStartOffset = 1; //start the week at Monday-weekStartOffset

const calcActivity = (activity, timeZone) => {
  let now = DateTime.fromObject({ zone: timeZone });

  const calcNextDisplayReset = repeat => {
    //if it repeats weekly or daily
    if (repeat.length === 1) {
      // return the start of the next day
      if (repeat[0]) return now.startOf('day').plus({ days: 1 });
      // return the start of the next week
      else return now.startOf('week').plus({ days: 7 - weekStartOffset });
    } else {
      // return the start of Math.min(the next onDay, the next week)
      let day = now.weekday - 1;
      let repeatWrap = repeat.concat(repeat);
      for (let i = day + 1; i < repeatWrap.length; i++) {
        if (repeatWrap[i]) {
          let daysDiff = i - day;
          let nextOnDay = now.startOf('day').plus({ days: daysDiff });
          let nextWeek = now
            .startOf('week')
            .plus({ days: 7 - weekStartOffset });

          return nextOnDay.ts < nextWeek.ts ? nextOnDay : nextWeek;
        }
      }
    }
  };

  const calcLastDisplayReset = repeat => {
    //if it repeats weekly or daily
    if (repeat.length === 1) {
      // return the start of today
      if (repeat[0]) return now.startOf('day');
      // return the start of this week
      else return now.startOf('week').minus({ days: weekStartOffset });
    } else {
      // return the start of Math.max(the last onDay, this week)
      let day = now.weekday - 1 + 7;
      let repeatWrap = repeat.concat(repeat);
      for (let i = day; i > 0; i--) {
        if (repeatWrap[i]) {
          let daysDiff = day - i;
          let lastOnDay = now.startOf('day').minus({ days: daysDiff });
          let thisWeek = now.startOf('week').minus({ days: weekStartOffset });

          return lastOnDay.ts > thisWeek.ts ? lastOnDay : thisWeek;
        }
      }
    }
  };

  activity.nextDisplayReset = calcNextDisplayReset(activity.repeat);
  activity.lastDisplayReset = calcLastDisplayReset(activity.repeat);
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
      let activities = state.activities;
      activities = activities.map(activity =>
        calcActivity(activity, state.timeZone)
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
