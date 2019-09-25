import React from 'react';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { ActivateIcon } from '../../resources/mySvgIcons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { repeatToText, msToShortTime } from '../../utils/convert';
import { changeDoing } from '../../actions/user';
import {
  CHANGE_ACTIVE,
  ACTIVE_CHANGED,
  UPDATE_USER
} from '../../actions/types';
import InverseSandTexture from '../test/InverseSandTexture';

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
  iconButton: {
    margin: -4
  },
  activateIcon: {
    color: 'rgba(0, 0, 0, .87)'
  },
  name: {
    fontWeight: 'bold',
    fontSize: '3.0rem',
    width: '100%',
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
    height: '.83rem'
  },
  breaktimeBar: {
    height: '.23rem',
    backgroundColor: '#FDD835'
  }
}));

const ActivityCard = ({
  activity,
  isActive,
  user,
  socket,
  isPreview,
  isChangingActive,
  dispatch,
  history
}) => {
  const classes = useStyles();

  const handleActivateClick = async () => {
    if (isActive || isPreview || isChangingActive) return;

    socket.emit('join room', user._id);
    dispatch({ type: CHANGE_ACTIVE });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let now = Date.now();
    let payload = {
      doNowId: activity._id,
      wasDoingId: user.active,
      time: now
    };
    const body = JSON.stringify(payload);
    const urlpre = process.env.REACT_APP_API_URL;
    const oldUserCopy = cloneDeep(user);

    try {
      dispatch(changeDoing(user, activity._id, user.active, now));

      await axios.post(`${urlpre}/api/activities/changeDoing`, body, config);

      socket.emit('change doing', activity._id, user.active, now);
    } catch (err) {
      dispatch({ type: ACTIVE_CHANGED });
      dispatch({ type: UPDATE_USER, payload: oldUserCopy });
    }
  };

  const handleEditClick = () => {
    if (!isPreview && !isChangingActive) {
      history.push(`/activities/edit/${activity._id}`);
    }
  };

  return (
    <Paper className={classes.card}>
      <div className={classes.actions}>
        <IconButton
          className={classes.iconButton}
          aria-label='activate'
          onClick={handleActivateClick}
          disabled={isPreview || isChangingActive}
        >
          <ActivateIcon
            className={classes.activateIcon}
            style={{ transform: `rotate(${isActive * 90}deg)` }}
          />
        </IconButton>
        <Typography noWrap className={classes.name}>
          {activity.name}
        </Typography>
        <IconButton
          className={classes.iconButton}
          aria-label='edit'
          disabled={isPreview || isChangingActive}
          onClick={handleEditClick}
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
              activity.displayProgress / (activity.displayTarget || 1),
              1
            )})`,
            backgroundColor: activity.color
          }}
        >
          <InverseSandTexture />
        </div>
        {activity.adds && (
          <div
            className={classes.breaktimeBar}
            style={{
              width: `calc(100% * (1 - ${Math.min(
                activity.displayProgress / (activity.displayTarget || 1),
                1
              )}))`
            }}
          >
            <InverseSandTexture />
          </div>
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
  isChangingActive: state.requests.isChangingActive,
  socket: state.auth.socket
});

export default connect(mapStateToProps)(withRouter(ActivityCard));
