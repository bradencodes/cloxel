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
    height: 100,
    position: 'sticky',
    top: 56
  },
  todo: {
    width: '100%',
    height: '200vh'
  }
}));

const Activities = props => {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <Paper className={classes.doing} elevation={12} square>
        <div>Content</div>
      </Paper>
      <Paper className={classes.todo} elevation={4}>
        <div>Content</div>
      </Paper>
    </div>
  );
};

Activities.propTypes = {};

export default Activities;
