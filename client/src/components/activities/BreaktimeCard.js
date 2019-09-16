import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import activate_icon from '../../resources/icons/activate_icon.svg';
import { msToShortTime } from '../../utils/convert';
import { changeDoing } from '../../actions/user';
import { CHANGE_ACTIVE } from '../../actions/types';
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
    fontSize: '1rem',
    fontWeight: '600',
    lineHeight: '1rem'
  },
  bars: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  progressBar: {
    height: '1.2rem',
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

  const handleActivateClick = e => {
    if (!isActive && !isChangingActive) {
      dispatch({ type: CHANGE_ACTIVE });
      let now = Date.now();
      socket.emit('change doing', user._id, breaktime._id, user.active, now);
      dispatch(changeDoing(user, breaktime._id, user.active, now));
    }
  };

  return (
    <Paper className={classes.card}>
      <div className={classes.actions}>
        <IconButton
          className={classes.activate}
          aria-label='activate'
          onClick={handleActivateClick}
          disabled={isChangingActive}
        >
          <div
            className={classes.activateContainer}
            style={{ opacity: isChangingActive ? '.38' : '.87' }}
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
                  backgroundColor: '#FDD835',
                  margin: `calc(12px * (1 - ${Math.min(
                    (breaktime.earned - breaktime.used) / 1800000,
                    1
                  )}) ) 0 0 -1px`
                }}
              >
                <InverseSandTexture width='100%' height='100%' />
              </div>
            </div>
          </div>
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
            TO USE
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
        >
          <InverseSandTexture width='100%' height='100%' />
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
