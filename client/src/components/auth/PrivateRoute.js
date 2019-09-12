import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import cloxelLogo from '../../resources/cloxelLogo.svg';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  progress: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  user,
  ...rest
}) => {
  const classes = useStyles();

  const userIsEmpty =
    Object.keys(user).length === 0 && user.constructor === Object;

  return loading || userIsEmpty ? (
    <div className={classes.progress}>
      <img
        src={cloxelLogo}
        alt='cloxelLogo'
        style={{ width: '192px', height: '192px' }}
      />
      <CircularProgress />
    </div>
  ) : (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !loading ? (
          <Redirect to='/signin' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

export default connect(mapStateToProps)(PrivateRoute);
