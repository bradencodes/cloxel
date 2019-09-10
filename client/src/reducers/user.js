import { USER_LOADED, CALC_ACTIVITIES } from '../actions/types';
import { DateTime } from 'luxon';

const initialState = {};

const weekStartOffset = 1; //start the week at Monday-weekStartOffset

const calcActivity = (activity, timeZone) => {

  const calcNextDisplayReset = repeat => {
    let now = DateTime.fromObject({zone: timeZone});
    //if it repeats weekly or daily
    if (repeat.length === 1) {
      // return the start of the next day
      if (repeat[0]) return now.startOf('day').plus({days: 1});
      // return the start of the next week
      else return now.startOf('week').plus({days: 7-weekStartOffset});
    }
    else {
      // return the start of Math.min(the next onDay, the next week)
      let day = now.weekday-1;
      let repeatWrap = repeat.concat(repeat);
      for (let i = day+1 ; i < repeatWrap.length ; i++) {
        if (repeatWrap[i]) {
          let daysDiff = i - day;
          let nextOnDay = now.startOf('day').plus({days: daysDiff});
          let nextWeek = now.startOf('week').plus({days: 7-weekStartOffset});

          return nextOnDay.ts < nextWeek.ts ? nextOnDay : nextWeek;
        }
      }
    }
  }

  activity.nextDisplayReset = calcNextDisplayReset(activity.repeat);
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
      activities = activities.map(activity => calcActivity(activity, state.timeZone));
      console.log(activities);
      return {
        ...state,
        activities
      }
    }

    default:
      return state;
  }
}
