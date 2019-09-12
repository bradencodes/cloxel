import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeDoing } from '../../actions/user';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, socket },
  user,
  ...rest
}) => {
  if (socket) {
    socket.on('change doing', (userId, doNowId, wasDoingId, time) => {
      changeDoing(user, doNowId, wasDoingId, time);
    });
  }

  return (
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
  user: PropTypes.object.isRequired,
  changeDoing: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

export default connect(
  mapStateToProps,
  { changeDoing }
)(PrivateRoute);
