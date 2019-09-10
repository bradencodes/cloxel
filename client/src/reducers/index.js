import { combineReducers } from 'redux';
import alerts from './alerts';
import auth from './auth';
import user from './user';

export default combineReducers({
  alerts,
  auth,
  user
});
