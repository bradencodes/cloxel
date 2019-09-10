import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue, yellow } from '@material-ui/core/colors';

// My Components
import Register from './components/auth/Register';
import SignIn from './components/auth/SignIn';
import TypographyTest from './components/test/TypographyTest';
import PrivateRoute from './components/auth/PrivateRoute';
import Activities from './components/dashboard/Dashboard';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

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

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
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
