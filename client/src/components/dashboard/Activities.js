import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {},
  doing: {
    backgroundColor: theme.palette.secondary.light,
    width: '100%',
    padding: theme.spacing(2),
    position: 'sticky',
    top: 56
  },
  todo: {
    width: '100%',
    height: 'calc(100% - 56px)',
    padding: theme.spacing(2)
  },
  activity: {
    height: 64,
    margin: theme.spacing(2, 0, 0)
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

const Activities = ({ show }) => {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <Paper
        className={`${classes.doing} ${
          show ? classes.show : classes.moveDoing
        }`}
        elevation={12}
        square
      >
        <div>Doing</div>
        <Paper className={`${classes.activity} `} />
      </Paper>
      <Paper className={classes.todo} elevation={4}>
        <div>To do</div>
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
        <Paper className={classes.activity} />
      </Paper>
    </div>
  );
};

Activities.propTypes = {};

export default Activities;
