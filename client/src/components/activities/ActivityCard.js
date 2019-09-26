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
import {
  ActivateIcon,
  AddsIcon,
  SubtractsIcon,
  PausesIcon,
  DoneIcon
} from '../../resources/mySvgIcons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { repeatToText, msToShortTime } from '../../utils/convert';
import { changeDoing } from '../../actions/user';
import {
  CHANGE_ACTIVE,
  ACTIVE_CHANGED,
  UPDATE_USER
} from '../../actions/types';
import InverseSandTexture from '../util/InverseSandTexture';

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
  toDoClip: {
    position: 'absolute',
    width: '1.36rem',
    height: '1.906rem',
    clipPath: 'polygon(10% 10%, 90% 50%, 10% 90%)'
  },
  doingClip: {
    position: 'absolute',
    width: '1.906rem',
    height: '1.36rem',
    clipPath: 'polygon(10% 10%, 90% 10%, 50% 90%)'
  },
  name: {
    fontWeight: 'bold',
    fontSize: '3.0rem',
    width: '100%'
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    marginBottom: -4
  },
  timeText: {
    fontSize: '1.8rem'
  },
  timeIcon: {
    margin: `-4px 4px`
  },
  repeatText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    lineHeight: '1rem',
    marginLeft: 8
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

  const handleTimeIcon = () => {
    if (activity.breaktimeProgress >= activity.breaktimeTarget)
      return (
        <SubtractsIcon
          className={classes.timeIcon}
          color={isActive ? 'action' : 'disabled'}
        />
      );
    else if (activity.adds)
      return (
        <AddsIcon
          className={classes.timeIcon}
          color={isActive ? 'action' : 'disabled'}
        />
      );
    else
      return (
        <PausesIcon
          className={classes.timeIcon}
          color={isActive ? 'action' : 'disabled'}
        />
      );
  };

  const handleActivateIcon = () => {
    if (activity.displayProgress >= activity.displayTarget)
      return (
        <DoneIcon
          style={{
            color: `rgba(0,0,0, ${
              isPreview || isChangingActive ? '0.38' : '0.87'
            }`
          }}
        />
      );
    else
      return (
        <>
          {isActive ? (
            <div className={classes.doingClip}>
              <div
                style={{
                  backgroundColor: activity.color,
                  opacity: isChangingActive ? '0.38' : '0.87',
                  marginTop: `${1.06 *
                    Math.min(
                      activity.displayProgress / (activity.displayTarget || 1),
                      1
                    )}rem`
                }}
              >
                <InverseSandTexture />
              </div>
            </div>
          ) : (
            <div className={classes.toDoClip}>
              <div
                style={{
                  backgroundColor: activity.color,
                  opacity: isChangingActive ? '0.38' : '0.87',
                  marginTop: `${1.7 *
                    Math.min(
                      activity.displayProgress / (activity.displayTarget || 1),
                      1
                    )}rem`
                }}
              >
                <InverseSandTexture />
              </div>
            </div>
          )}
          <ActivateIcon
            style={{
              color: `rgba(0,0,0, ${
                isPreview || isChangingActive ? '0.38' : '0.87'
              }`,
              transform: `rotate(${isActive * 90}deg)`
            }}
          />
        </>
      );
  };

  return (
    <Paper className={classes.card} elevation={2}>
      <div className={classes.actions}>
        <IconButton
          className={classes.iconButton}
          aria-label='activate'
          onClick={handleActivateClick}
          disabled={isPreview || isChangingActive}
          style={{
            color: `rgba(0,0,0, ${
              isPreview || isChangingActive ? '0.38' : '0.87'
            }`
          }}
        >
          {handleActivateIcon()}
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
        <Typography
          color='textSecondary'
          className={classes.timeText}
          style={{
            fontWeight:
              activity.displayProgress < activity.displayTarget ? '500' : 'bold'
          }}
        >
          {msToShortTime(activity.displayProgress)}
          {handleTimeIcon()}
        </Typography>
        <Typography
          color='textSecondary'
          className={classes.timeText}
          style={{ fontWeight: 'bold', textAlign: 'right' }}
        >
          / {msToShortTime(activity.displayTarget)}
          <span className={classes.repeatText}>
            {repeatToText(activity.repeat)}
          </span>
        </Typography>
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
