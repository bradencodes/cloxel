import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import { msToShortTime } from '../../utils/convert';

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(2, 0, 0),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    margin: '-4px -4px -8px'
  },
  name: {
    fontWeight: 'bold',
    fontSize: '3.0rem',
    width: '100%',
    marginLeft: -8
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    marginBottom: -4
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
    height: 12,
    backgroundColor: '#FDD835'
  },
}));

const BreaktimeCard = ({ breaktime, active }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.card}>
      <div className={classes.actions}>
        <IconButton className={classes.activate} aria-label='activate'>
          <PlayArrowOutlinedIcon
            style={{ transform: `rotate(${active * 90}deg)` }}
          />
        </IconButton>
        <Typography variant='h5' className={classes.name}>
          {breaktime.name}
        </Typography>
      </div>

      <div className={classes.time}>
        <div className={classes.times}>
          <Typography color='textSecondary' className={classes.timeText}>
            {msToShortTime(breaktime.earned - breaktime.used)}
          </Typography>
        </div>
        <div className={classes.repeatContainer}>
          <Typography
            variant='caption'
            color='textSecondary'
            className={classes.repeatText}
          >
            TO
            <br />
            USE
          </Typography>
        </div>
      </div>

      <div className={classes.bars}>
        <div
          className={classes.progressBar}
          style={{
            width: `calc(100% * ${Math.min(
              (breaktime.earned - breaktime.used) / 1800000,
              1
            )})`
          }}
        />
      </div>
    </Paper>
  );
};

BreaktimeCard.propTypes = {
  breaktime: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
};

export default BreaktimeCard;
