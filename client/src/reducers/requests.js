import {
  CHANGE_ACTIVE,
  ACTIVE_CHANGED,
  ADD_ACTIVITY,
  ACTIVITY_ADDED,
  EDIT_ACTIVITY,
  ACTIVITY_EDITED,
  ANIMATE
} from '../actions/types';

const initialState = {
  isChangingActive: false,
  isAddingActivity: false,
  isEditingActivity: false,
  animate: true
};

export default function(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case CHANGE_ACTIVE:
      return {
        ...state,
        isChangingActive: true,
        animate: !state.animate
      };

    case ACTIVE_CHANGED:
      return {
        ...state,
        isChangingActive: false
      };

    case ADD_ACTIVITY:
      return {
        ...state,
        isAddingActivity: true,
        animate: !state.animate
      };

    case ACTIVITY_ADDED:
      return {
        ...state,
        isAddingActivity: false
      };

    case EDIT_ACTIVITY:
      return {
        ...state,
        isEditingActivity: true,
        animate: !state.animate
      };

    case ACTIVITY_EDITED:
      return {
        ...state,
        isEditingActivity: false
      };

    case ANIMATE:
      return {
        ...state,
        animate: !state.animate
      };

    default:
      return state;
  }
}
