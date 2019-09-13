import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { repeatToText, msToShortTime } from '../../utils/convert';
import { changeDoing } from '../../actions/user';
import { START_HANDLING_REQUEST } from '../../actions/types';

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
    width: '4.7rem',
    lineHeight: '0',
    textAlign: 'center'
  },
  repeatText: {
    fontSize: '1.0rem',
    fontWeight: '600',
    lineHeight: '1rem'
  },
  bars: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  progressBar: {
    height: '1.2rem'
  },
  breaktimeBar: {
    height: '.6rem',
    backgroundColor: '#FDD835'
  }
}));

const ActivityCard = ({
  activity,
  isActive,
  user,
  socket,
  isPreview,
  isHandlingRequest,
  dispatch
}) => {
  const classes = useStyles();

  const handleActivateClick = e => {
    if (!isActive && !isPreview && !isHandlingRequest) {
      dispatch({ type: START_HANDLING_REQUEST });
      let now = Date.now();
      socket.emit('change doing', user._id, activity._id, user.active, now);
      dispatch(changeDoing(user, activity._id, user.active, now));
    }
  };

  return (
    <Paper className={classes.card}>
      <div className={classes.actions}>
        <IconButton
          className={classes.activate}
          aria-label='activate'
          onClick={handleActivateClick}
          disabled={isPreview || isHandlingRequest}
        >
          <PlayArrowOutlinedIcon
            style={{ transform: `rotate(${isActive * 90}deg)` }}
          />
        </IconButton>
        <Typography variant='h5' noWrap className={classes.name}>
          {activity.name}
        </Typography>
        <IconButton
          className={classes.edit}
          aria-label='edit'
          disabled={isPreview || isHandlingRequest}
        >
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
                activity.displayProgress / (activity.displayTarget || 1),
                1
              )}))`
            }}
          />
        )}
      </div>
    </Paper>
  );
};

ActivityCard.propTypes = {
  activity: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  isHandlingRequest: state.auth.isHandlingRequest,
  socket: state.auth.socket
});

export default connect(mapStateToProps)(ActivityCard);
