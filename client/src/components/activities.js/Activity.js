import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { repeatToText, msToShortTime } from '../../utils/convert';

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(2, 0, 0),
    display: 'flex',
    flexDirection: 'column'
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  name: {
    fontWeight: 'bold',
    fontSize: '3.0rem',
    width: '100%'
  },
  time: {
    display: 'flex',
    alignItems: 'center'
  },
  times: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  repeatContainer: {
    fontWeight: 'bold',
    width: '40px',
    lineHeight: '0',
    textAlign: 'center'
  },
  repeatText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    lineHeight: '1rem'
  }
}));

const Activity = ({ activity }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.card}>
      <div className={classes.actions}>
        <IconButton className={classes.activate} aria-label='activate'>
          <PlayArrowOutlinedIcon />
        </IconButton>
        <Typography variant='h5' className={classes.name}>
          {activity.name}
        </Typography>
        <IconButton className={classes.edit} aria-label='edit'>
          <EditOutlinedIcon />
        </IconButton>
      </div>

      <div className={classes.time}>
        <div className={classes.times}>
          <Typography color='textSecondary' className={classes.timeText}>
            {msToShortTime(activity.displayProgress)}
          </Typography>
          <Typography color='textSecondary' className={classes.timeText}>
            {msToShortTime(activity.displayTarget)}
          </Typography>
        </div>
        <div className={classes.repeatContainer}>
          <Typography
            variant='caption'
            color='textSecondary'
            className={classes.repeatText}
          >
            {repeatToText(activity.repeat)}
          </Typography>
        </div>
      </div>

      <div className={classes.bars}></div>
    </Paper>
  );
};

Activity.propTypes = {};

export default Activity;
