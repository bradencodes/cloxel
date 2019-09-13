import { combineReducers } from 'redux';
import alerts from './alerts';
import auth from './auth';
import user from './user';
import requests from './requests';

export default combineReducers({
  alerts,
  auth,
  user,
  requests
});
