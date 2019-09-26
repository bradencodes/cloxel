import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import BeachAccessOutlinedIcon from '@material-ui/icons/BeachAccessOutlined';
import { msToShortTime } from '../../utils/convert';
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
  breaktimeClip: {
    position: 'absolute',
    width: '3rem',
    height: '3rem',
    margin: '.1rem 0 0 .1rem',
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
  },
  breaktimeFill: {
    width: '100%',
    height: '100%',
    borderRadius: 500
  },
  breaktimeIcon: {
    zIndex: 1
  },
  name: {
    fontWeight: 'bold',
    fontSize: '3.0rem',
    width: '100%'
  },
  time: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    marginBottom: -4
  },
  timeText: {
    fontSize: '1.8rem'
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
    height: '.83rem',
    backgroundColor: '#FDD835'
  }
}));

const BreaktimeCard = ({
  breaktime,
  isActive,
  user,
  socket,
  dispatch,
  isChangingActive
}) => {
  const classes = useStyles();

  const handleActivateClick = async () => {
    if (isActive || isChangingActive) return;

    socket.emit('join room', user._id);
    dispatch({ type: CHANGE_ACTIVE });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let now = Date.now();
    let payload = {
      doNowId: breaktime._id,
      wasDoingId: user.active,
      time: now
    };
    const body = JSON.stringify(payload);
    const urlpre = process.env.REACT_APP_API_URL;
    const oldUserCopy = cloneDeep(user);

    try {
      dispatch(changeDoing(user, breaktime._id, user.active, now));

      await axios.post(`${urlpre}/api/activities/changeDoing`, body, config);

      socket.emit('change doing', breaktime._id, user.active, now);
    } catch (err) {
      dispatch({ type: ACTIVE_CHANGED });
      dispatch({ type: UPDATE_USER, payload: oldUserCopy });
    }
  };

  return (
    <Paper className={classes.card} elevation='2'>
      <div className={classes.actions}>
        <IconButton
          className={classes.iconButton}
          aria-label='activate'
          onClick={handleActivateClick}
          disabled={isChangingActive}
          style={{
            color: `rgba(0,0,0, ${isChangingActive ? '0.38' : '0.87'}`
          }}
        >
          <div className={classes.breaktimeClip}>
            <div
              style={{
                backgroundColor: breaktime.color,
                opacity: isChangingActive ? '0.38' : '0.87',
                marginTop: `${3 -
                  3 *
                    Math.min(
                      (breaktime.earned - breaktime.used) / 1800000,
                      1
                    )}rem`
              }}
              className={classes.breaktimeFill}
            />
          </div>
          <BeachAccessOutlinedIcon className={classes.breaktimeIcon} />
        </IconButton>
        <Typography className={classes.name}>{breaktime.name}</Typography>
      </div>

      <div className={classes.time}>
        <Typography
          color='textSecondary'
          className={classes.timeText}
          style={{
            fontWeight:
              breaktime.earned - breaktime.used < 1800000 ? '500' : 'bold'
          }}
        >
          {msToShortTime(breaktime.earned - breaktime.used)}
        </Typography>
        <Typography
          variant='caption'
          color='textSecondary'
          className={classes.repeatText}
        >
          TO USE
        </Typography>
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
        >
          <InverseSandTexture />
        </div>
      </div>
    </Paper>
  );
};

BreaktimeCard.propTypes = {
  breaktime: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  isChangingActive: state.requests.isChangingActive,
  socket: state.auth.socket
});

export default connect(mapStateToProps)(BreaktimeCard);
