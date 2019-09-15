import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue, yellow } from '@material-ui/core/colors';
import io from 'socket.io-client';

// My Components
import Register from './components/auth/Register';
import SignIn from './components/auth/SignIn';
import TypographyTest from './components/test/TypographyTest';
import PrivateRoute from './components/auth/PrivateRoute';
import Activities from './components/dashboard/Dashboard';
import AddActivity from './components/activities/AddActivity';
import CatchAll from './components/auth/CatchAll';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import { changeDoing } from './actions/user';
import { addActivityToRedux } from './actions/activities';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import { INIT_SOCKET, ACTIVE_CHANGED, ACTIVITY_ADDED } from './actions/types';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const theme = createMuiTheme({
  palette: {
    primary: { main: lightBlue[800] },
    secondary: {
      main: yellow[600],
      light: yellow[50]
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

      socket.on('change doing', (userId, doNowId, wasDoingId, time) => {
        if (!store.getState().requests.isChangingActive) {
          store.dispatch(
            changeDoing(store.getState().user, doNowId, wasDoingId, time)
          );
        }
        store.dispatch({ type: ACTIVE_CHANGED });
      });

      socket.on('add activity', activity => {
        if (!store.getState().requests.isAddingActivity) {
          console.log('add activity triggered from socket');
          store.dispatch(addActivityToRedux(activity, store.getState().user));
        }
        store.dispatch({ type: ACTIVITY_ADDED });
      });
    }
    initSocket();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <section className='container'>
            <ThemeProvider theme={theme}>
              <Switch>
                <Route exact path='/register' component={Register} />
                <Route exact path='/signin' component={SignIn} />
                <PrivateRoute exact path='/activities' component={Activities} />
                <PrivateRoute
                  exact
                  path='/activities/create'
                  component={AddActivity}
                />
                <Route component={CatchAll} />
                <Route exact path='/type-test' component={TypographyTest} />
              </Switch>
            </ThemeProvider>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
