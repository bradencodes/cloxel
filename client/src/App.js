import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { lightBlue, yellow } from '@material-ui/core/colors';

// My Components
import Register from './components/auth/Register';
import SignIn from './components/auth/SignIn';

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
              </Switch>
            </ThemeProvider>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
