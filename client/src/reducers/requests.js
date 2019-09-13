import { CHANGE_ACTIVE, ACTIVE_CHANGED } from '../actions/types';

const initialState = {
  isChangingActive: false,
  isAddingActivity: false,
  isEditingActivity: false
};

export default function(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case CHANGE_ACTIVE:
      return {
        ...state,
        isChangingActive: true
      };

    case ACTIVE_CHANGED:
      return {
        ...state,
        isChangingActive: false
      };

    default:
      return state;
  }
}
