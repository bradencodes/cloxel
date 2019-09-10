import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Activity from './Activity';

const useStyles = makeStyles(theme => ({
  doing: {
    backgroundColor: theme.palette.secondary.light,
    width: '100%',
    padding: theme.spacing(2),
    position: 'sticky',
    zIndex: 1, //keeps on top
    top: 56
    // top: 20
  },
  todo: {
    width: '100%',
    position: 'relative', //shadow shows
    padding: theme.spacing(2)
  },
  done: {
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#e6e6e6'
  },
  show: {
    transform: 'translate(0, 0)',
    transition: 'transform .25s'
  },
  moveDoing: {
    transform: 'translate(0, -56px)',
    transition: 'transform .25s'
  }
}));

const Activities = ({ show, user }) => {
  const classes = useStyles();

  const activities = user.activities;
  const doing = activities.find(activity => activity.id === user.active) || [];
  const todo = activities.filter(
    activity =>
      activity.id !== user.active &&
      activity.displayProgress < activity.displayTarget
  );
  const done = activities.filter(
    activity =>
      activity.id !== user.active &&
      activity.displayProgress >= activity.displayTarget
  );

  return (
    <React.Fragment>
      <Paper
        className={`${classes.doing} ${
          show ? classes.show : classes.moveDoing
        }`}
        elevation={12}
        square
      >
        <div>Doing</div>
      </Paper>
      <Paper className={classes.todo} elevation={4} square>
        <div>To do</div>
        {todo.map(activity => (
          <Activity key={activity._id} activity={activity} />
        ))}
      </Paper>
      <Paper className={classes.done} elevation={0} square>
        <div>Done</div>
      </Paper>
    </React.Fragment>
  );
};

Activities.propTypes = {
  show: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Activities);
