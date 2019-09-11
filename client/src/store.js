import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { tick } from './actions/user';

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

let nextSecond = 1000 - (Date.now() % 1000);
setTimeout(() => {
  setInterval(() => {
    let user = store.getState().user;
    store.dispatch(tick(user));
  }, 1000);
}, nextSecond);

export default store;
