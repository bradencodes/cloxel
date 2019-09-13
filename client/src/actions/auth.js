import axios from 'axios';
import { setAlerts } from './alerts';
import { calcActivities } from '../utils/calc';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';
import setAuthToken from '../utils/setAuthToken';
import { DateTime } from 'luxon';

const urlpre = process.env.REACT_APP_API_URL;

// Load User
export const loadUser = socket => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`${urlpre}/api/auth`);

    socket.emit('join room', res.data._id);

    res.data.socket = socket;

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
    dispatch(calcActivities(res.data));
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({
  name,
  email,
  password,
  socket
}) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const initBreaktimeStart = DateTime.local()
    .startOf('week')
    .minus({ days: 1 }).ts;

  const body = JSON.stringify({ name, email, password, initBreaktimeStart });

  try {
    const res = await axios.post(`${urlpre}/api/users`, body, config);

    dispatch({ type: REGISTER_SUCCESS, payload: res.data });

    dispatch(loadUser(socket));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch(setAlerts({ errors }));
    }

    dispatch({ type: REGISTER_FAIL });
  }
};

// Login User
export const login = (email, password, socket) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post(`${urlpre}/api/auth`, body, config);

    dispatch({ type: LOGIN_SUCCESS, payload: res.data });

    dispatch(loadUser(socket));
  } catch (err) {
    const errors = err.response ? err.response.data.errors : null;

    if (errors) {
      dispatch(setAlerts({ errors }));
    }

    dispatch({ type: LOGIN_FAIL });
  }
};

// Logout
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};
