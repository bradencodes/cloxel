import React from 'react';
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
  activateIcon: {
    zIndex: '1'
  },
  activateSvg: {},
  activateSand: {
    height: '30px',
    width: '30px',
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: '-1',
    clipPath: 'polygon(1.05 2.02 1.05 16.02 11.05 9.03 1.05 2.02)'
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
  dispatch
}) => {
  const classes = useStyles();

  const handleActivateClick = e => {
    if (!isActive && !isPreview && !isChangingActive) {
      dispatch({ type: CHANGE_ACTIVE });
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
          disabled={isPreview || isChangingActive}
        >
          <div className={classes.activateIcon}>
            <img
              src={activate_icon}
              alt='activate'
              style={{
                transform: `rotate(${isActive * 90}deg)`,
                opacity: isPreview || isChangingActive ? '.38' : '.54'
              }}
              className={classes.activateSvg}
            />
            <div
              className={classes.activateSand}
              style={{ backgroundColor: activity.color }}
            >
              <InverseSandTexture width='100%' height='100%' />
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
          <InverseSandTexture width='100%' height='100%' />
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
            <InverseSandTexture width='100%' height='100%' />
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

export default connect(mapStateToProps)(ActivityCard);
