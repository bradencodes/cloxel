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
import activate_icon from '../../resources/icons/activate_icon.svg';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { repeatToText, msToShortTime } from '../../utils/convert';
import { changeDoing } from '../../actions/user';
import {
  CHANGE_ACTIVE,
  ACTIVE_CHANGED,
  UPDATE_USER
} from '../../actions/types';
import { setAlerts } from '../../actions/alerts';
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
    alignItems: 'center',
    margin: '-4px -4px -8px'
  },
  activate: {
    height: 48,
    width: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activateContainer: {
    zIndex: '1',
    width: '12.73px',
    height: '17.83px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activateSvg: {},
  activateSand: {
    height: '13px',
    width: '16px',
    zIndex: '-1'
  },
  sand: {
    width: 30,
    height: 30
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
    height: '11.3px',
    fill: 'currentColor'
  },
  breaktimeBar: {
    height: '5.3px',
    fill: 'currentColor',
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

  return (
    <Paper className={classes.card}>
      <div className={classes.actions}>
        <IconButton
          className={classes.activate}
          aria-label='activate'
          onClick={handleActivateClick}
          disabled={isPreview || isChangingActive}
        >
          <div
            className={classes.activateContainer}
            style={{ opacity: isPreview || isChangingActive ? '.38' : '.87' }}
          >
            <img
              src={activate_icon}
              alt='activate'
              className={classes.activateSvg}
              style={{ transform: `rotate(${isActive * 90}deg)` }}
            />
            <div
              className={classes.activateSand}
              style={{
                clipPath: isActive
                  ? 'polygon(0% 0%, 100% 0%, 50% 90%)'
                  : 'polygon(0% 0%, 50% 50%, 0% 100%)',
                marginLeft: isActive ? '-14px' : '-11px'
              }}
            >
              <div
                className={classes.sand}
                style={{
                  backgroundColor: activity.color,
                  margin: `calc(12px * ${Math.min(
                    activity.displayProgress / (activity.displayTarget || 1),
                    1
                  )}) 0 0 -1px`
                }}
              >
                <InverseSandTexture />
              </div>
            </div>
          </div>
        </IconButton>
        <Typography variant='h5' noWrap className={classes.name}>
          {activity.name}
        </Typography>
        <IconButton
          className={classes.edit}
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
