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
    flexDirection: 'column',
    overflow: 'hidden'
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
    alignItems: 'center',
    padding: theme.spacing(0, 1)
  },
  times: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: theme.spacing(1)
  },
  timeText: {
    fontSize: '2rem',
    fontWeight: '500'
  },
  repeatContainer: {
    fontWeight: 'bold',
    width: '40px',
    lineHeight: '0',
    textAlign: 'center'
  },
  repeatText: {
    fontSize: '1rem',
    fontWeight: '600',
    lineHeight: '1rem'
  },
  bars: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  progressBar: {
    height: 12
  },
  breaktimeBar: {
    height: 6,
    backgroundColor: '#FDD835'
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

      <div className={classes.bars}>
        <div
          className={classes.progressBar}
          style={{
            width: `calc(100% * ${Math.min(
              activity.displayProgress / activity.displayTarget,
              1
            )})`,
            backgroundColor: activity.color
          }}
        />
        {activity.adds && (
          <div
            className={classes.breaktimeBar}
            style={{
              width: `calc(100% * (1 - ${Math.min(
                activity.displayProgress / activity.displayTarget,
                1
              )}))`
            }}
          />
        )}
      </div>
    </Paper>
  );
};

Activity.propTypes = {};

export default Activity;
