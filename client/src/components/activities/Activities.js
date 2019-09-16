import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ActivityCard from './ActivityCard';
import AddActivityCard from './AddActivityCard';
import BreaktimeCard from './BreaktimeCard';
import { msToShortTime } from '../../utils/convert';
import { sortActivities } from '../../utils/calc';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexFlow: 'column',
    minHeight: 'calc(100vh - 56px)'
  },
  doing: {
    backgroundColor: theme.palette.secondary.light,
    width: '100%',
    height: 'calc(100% + 10px)',
    padding: theme.spacing(2),
    position: 'sticky',
    zIndex: 10, //keeps on top
    top: 56
  },
  todo: {
    width: '100%',
    position: 'relative', //shadow shows
    padding: theme.spacing(2)
  },
  done: {
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#e6e6e6',
    flexGrow: '1'
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
  const doing = activities.filter(activity => activity._id === user.active);
  let todo = activities.filter(
    activity =>
      activity._id !== user.active &&
      activity.displayProgress < activity.displayTarget
  );
  todo = sortActivities(todo, user.timeZone);
  let done = activities.filter(
    activity =>
      activity._id !== user.active &&
      activity.displayProgress >= activity.displayTarget
  );
  done = sortActivities(done, user.timeZone);

  const breaktimePlace = (() => {
    let breaktime = user.breaktime;
    if (user.active === breaktime._id) return 'doing';
    if (breaktime.used < breaktime.target) {
      if (breaktime.earned - breaktime.used > 1800000) return 'todo top';
      else return 'todo bottom';
    } else return 'done';
  })();

  return (
    <div className={classes.container}>
      <Paper
        className={`${classes.doing} ${
          show ? classes.show : classes.moveDoing
        }`}
        elevation={12}
        square
      >
        <div>
          Doing (for{' '}
          {doing.length
            ? msToShortTime(
                doing[0].end[doing[0].end.length - 1] -
                  doing[0].start[doing[0].start.length - 1]
              )
            : msToShortTime(
                user.breaktime.end[user.breaktime.end.length - 1] -
                  user.breaktime.start[user.breaktime.start.length - 1]
              )}
          )
        </div>
        {doing.map(activity => (
          <ActivityCard
            key={activity._id}
            activity={activity}
            isActive={true}
          />
        ))}
        {breaktimePlace === 'doing' && (
          <BreaktimeCard breaktime={user.breaktime} isActive={true} />
        )}
      </Paper>
      <Paper className={classes.todo} elevation={4} square>
        <div>To do</div>
        {breaktimePlace === 'todo top' && (
          <BreaktimeCard breaktime={user.breaktime} isActive={false} />
        )}
        {todo.map(activity => (
          <ActivityCard
            key={activity._id}
            activity={activity}
            isActive={false}
          />
        ))}
        {breaktimePlace === 'todo bottom' && (
          <BreaktimeCard breaktime={user.breaktime} isActive={false} />
        )}
        <AddActivityCard />
      </Paper>
      <Paper className={classes.done} elevation={0} square>
        <div>Done</div>
        {breaktimePlace === 'done' && (
          <BreaktimeCard breaktime={user.breaktime} isActive={false} />
        )}
        {done.map(activity => (
          <ActivityCard
            key={activity._id}
            activity={activity}
            isActive={false}
          />
        ))}
      </Paper>
    </div>
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