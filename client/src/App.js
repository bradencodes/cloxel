import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Flipper } from 'react-flip-toolkit';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue, yellow } from '@material-ui/core/colors';
import io from 'socket.io-client';

// My Components
import Register from './components/auth/Register';
import SignIn from './components/auth/SignIn';
import TypographyTest from './components/util/TypographyTest';
import PrivateRoute from './components/auth/PrivateRoute';
import Activities from './components/dashboard/Dashboard';
import AddActivity from './components/activities/AddActivity';
import EditActivity from './components/activities/EditActivity';
import CatchAll from './components/auth/CatchAll';
import ScrollToTop from './components/util/ScrollToTop';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import { changeDoing } from './actions/user';
import {
  addActivityToRedux,
  editActivityInRedux,
  deleteActivityInRedux
} from './actions/activities';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import {
  INIT_SOCKET,
  ACTIVE_CHANGED,
  ACTIVITY_ADDED,
  ACTIVITY_EDITED
} from './actions/types';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue[800],
      light: lightBlue[100]
    },
    secondary: {
      main: yellow[600],
      light: yellow[100]
    }
  },
  typography: {
    fontFamily: [
      'Dubai',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    fontSize: 15,
    htmlFontSize: 10,
    caption: {
      fontSize: 14
    },
    button: {
      fontSize: 14.5,
      letterSpacing: 0.5
    },
    overline: {
      fontSize: 13.5,
      letterSpacing: 0.5
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': 'Dubai'
      }
    }
  }
});

const urlpre = process.env.REACT_APP_API_URL;

const App = () => {
  useEffect(() => {
    async function initSocket() {
      let socket = await io.connect(`${urlpre}/userRooms`);

      store.dispatch({ type: INIT_SOCKET, payload: { socket } });

      store.dispatch(loadUser(socket));

      socket.on('change doing', (doNowId, wasDoingId, time) => {
        if (!store.getState().requests.isChangingActive) {
          store.dispatch(
            changeDoing(store.getState().user, doNowId, wasDoingId, time)
          );
        }
        store.dispatch({ type: ACTIVE_CHANGED });
      });

      socket.on('add activity', activity => {
        if (!store.getState().requests.isAddingActivity) {
          store.dispatch(addActivityToRedux(activity, store.getState().user));
        }
        store.dispatch({ type: ACTIVITY_ADDED });
      });

      socket.on('edit activity', activity => {
        if (!store.getState().requests.isEditingActivity) {
          store.dispatch(editActivityInRedux(activity, store.getState().user));
        }
        store.dispatch({ type: ACTIVITY_EDITED });
      });

      socket.on('delete activity', activity => {
        if (!store.getState().requests.isEditingActivity) {
          store.dispatch(
            deleteActivityInRedux(activity, store.getState().user)
          );
        }
        store.dispatch({ type: ACTIVITY_EDITED });
      });
    }
    initSocket();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop>
          <section className='container'>
            <ThemeProvider theme={theme}>
              <Flipper flipKey={store.getState().requests.animate}>
                <Switch>
                  <Route exact path='/register' component={Register} />
                  <Route exact path='/signin' component={SignIn} />
                  <PrivateRoute
                    exact
                    path='/activities'
                    component={Activities}
                  />
                  <PrivateRoute
                    exact
                    path='/activities/create'
                    component={AddActivity}
                  />
                  <PrivateRoute
                    exact
                    path='/activities/edit/:id'
                    component={EditActivity}
                  />
                  <Route exact path='/type-test' component={TypographyTest} />
                  <Route component={CatchAll} />
                </Switch>
              </Flipper>
            </ThemeProvider>
          </section>
        </ScrollToTop>
      </Router>
    </Provider>
  );
};

export default App;
