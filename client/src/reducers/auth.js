import {
  INIT_SOCKET,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  START_HANDLING_REQUEST,
  REQUEST_HANDLED
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  socket: null,
  isHandlingRequest: false
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case INIT_SOCKET:
      return {
        ...state,
        socket: payload.socket
      };

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };

    case START_HANDLING_REQUEST:
      return {
        ...state,
        isHandlingRequest: true
      };

    case REQUEST_HANDLED:
      return {
        ...state,
        isHandlingRequest: false
      };

    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };

    default:
      return state;
  }
}
