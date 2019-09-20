import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { clearAlerts } from '../../actions/alerts';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ActivityCard from './ActivityCard';
import { setAlerts } from '../../actions/alerts';
import { getUnusedColors, stylingColors } from '../../utils/colors';
import { msToShortTime, shortTimeToMS } from '../../utils/convert';
import { EDIT_ACTIVITY, ACTIVITY_EDITED } from '../../actions/types';
import { editActivityInRedux, deleteActivityInRedux } from '../../actions/activities';
const urlpre = process.env.REACT_APP_API_URL;

// const CustomTextField = withStyles({
//   root: {
//     '& label.Mui-focused': {
//       color: props => props.csscolor
//     },
//     '& .MuiInput-underline:after': {
//       borderBottomColor: props => props.csscolor
//     }
//   }
// })(TextField);

// const CustomSelect = withStyles({
//   root: {
//     '& label.Mui-focused': {
//       color: props => props.csscolor
//     },
//     '& .MuiInput-underline:after': {
//       borderBottomColor: props => props.csscolor
//     }
//   }
// })(Select);

const useStyles = makeStyles(theme => ({
  exitButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  appBarSpacer: theme.mixins.toolbar,
  previewActivity: {
    position: 'fixed',
    width: '100%',
    padding: theme.spacing(0, 2),
    zIndex: 1,
    backgroundColor: stylingColors.white
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '9rem',
    position: 'relative'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  formControl: {
    width: '100%'
  },
  colorSelected: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1, 0)
  },
  colorPrev: {
    width: 12,
    height: 12,
    borderRadius: 100,
    marginRight: theme.spacing(1)
  },
  days: {
    display: 'flex',
    flexFlow: 'row wrap',
    margin: '-4rem 0 0 9.5rem',
    justifyContent: 'space-around',
    maxWidth: '25rem',
    width: 'calc(100% - 9.5rem)',
    pointerEvents: 'none',
    opacity: '.87',
    transition: 'opacity .15s'
  },
  day: {
    height: '2rem',
    width: '2.4rem',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    margin: '.8rem 0 0 .8rem',
    pointerEvents: 'auto',
    cursor: 'pointer',
    transition: 'background-color .15s'
  },
  dayOn: {
    color: '#ffffff',
    backgroundColor: '#000000'
  },
  dayOff: {
    opacity: '.62'
  },
  earns: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 0
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const EditActivity = ({
  dispatch,
  alerts,
  socket,
  user,
  activities,
  history,
  match,
  isEditingActivity
}) => {
  useEffect(() => {
    return () => {
      dispatch(clearAlerts());
    };
  }, [dispatch]);

  const classes = useStyles();
  const activityId = match.params.id;
  let activity = activities.find(activity => activity._id === activityId);
  let colors = getUnusedColors(activities, activity.color);
  const days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];

  const [formData, setFormData] = useState({
    name: activity.name,
    color: colors.find(color => color.hex === activity.color),
    target: msToShortTime(activity.displayTarget),
    repeatWord:
      activity.repeat.length === 1
        ? activity.repeat[0]
          ? 'daily'
          : 'weekly'
        : 'onDays',
    repeatArray: activity.repeat,
    earns: activity.adds
  });

  const { name, color, target, repeatWord, repeatArray, earns } = formData;

  const correctRepeatArray = array => {
    if (array.length !== 7) return array;
    let reduced = array.reduce((t, v) => (t += v), 0);
    if (reduced === 0) return [0];
    if (reduced === 7) return [1];
    return array;
  };

  const activityPreview = {
    ...activity,
    repeat: correctRepeatArray(repeatArray),
    name,
    color: color.hex,
    displayTarget: shortTimeToMS(target) > 0 ? shortTimeToMS(target) : 0,
    adds: earns
  };

  const nameError = alerts.errors.filter(error => error.param === 'name')[0];

  const handleExit = async () => {
    if (isEditingActivity) return;
    await history.push('/activities');
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (isEditingActivity) return;

    dispatch({ type: EDIT_ACTIVITY });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify(activityPreview);

    try {
      const res = await axios.put(
        `${urlpre}/api/activities/${activity._id}`,
        body,
        config
      );
      let editedActivity = res.data;
      socket.emit('edit activity', editedActivity);
      dispatch(editActivityInRedux(editedActivity, user));
      history.push('/activities');
    } catch (err) {
      const errors = err.response.data.errors;
      dispatch({ type: ACTIVITY_EDITED });

      dispatch(setAlerts({ errors }));
    }
  };

  const handleDayClass = i => {
    if (repeatWord === 'onDays' && repeatArray[i])
      return `${classes.day} ${classes.dayOn}`;
    else return `${classes.day} ${classes.dayOff}`;
  };

  const setRepeats = repeatWord => {
    let newRepeatArray;
    if (repeatWord === 'weekly') newRepeatArray = [0];
    else if (repeatWord === 'daily') newRepeatArray = [1];
    else newRepeatArray = [0, 0, 0, 0, 0, 0, 0];
    setFormData(prev => ({ ...prev, repeatWord, repeatArray: newRepeatArray }));
  };

  const toggleDay = i => {
    let newRepeatArray;
    if (repeatArray.length !== 7) {
      setRepeats('onDays');
      newRepeatArray = [0, 0, 0, 0, 0, 0, 0];
    } else newRepeatArray = repeatArray;
    newRepeatArray[i] = !newRepeatArray[i];
    setFormData(prev => ({ ...prev, repeatArray: newRepeatArray }));
  };

  const toggleEarns = () => {
    setFormData(prev => ({ ...prev, earns: !prev.earns }));
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  function handleClickMore(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMore() {
    setAnchorEl(null);
  }

  const handleDelete = async () => {
    if (isEditingActivity) return;

    dispatch({ type: EDIT_ACTIVITY });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      await axios.delete(`${urlpre}/api/activities/${activity._id}`, config );
      socket.emit('delete activity', activity);
      history.push('/activities');
      dispatch(deleteActivityInRedux(activity, user));
    } catch (err) {
      const errors = err.response.data.errors;
      dispatch({ type: ACTIVITY_EDITED });

      dispatch(setAlerts({ errors }));
    }
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.exitButton}
            color='inherit'
            aria-label='exit'
            onClick={handleExit}
            disabled={isEditingActivity}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            Edit
          </Typography>
          <IconButton
            color='inherit'
            aria-label='save'
            onClick={onSave}
            disabled={isEditingActivity}
          >
            <SaveOutlinedIcon />
          </IconButton>
          <IconButton
            color='inherit'
            aria-label='more'
            aria-controls='long-menu'
            aria-haspopup='true'
            disabled={isEditingActivity}
            onClick={handleClickMore}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id='long-menu'
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleCloseMore}
          >
            <MenuItem
              key='delete'
              onClick={handleDelete}
              style={{ color: '#B00020' }}
            >
              Delete
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <div className={classes.appBarSpacer} />

      <div className={classes.previewActivity}>
        <ActivityCard
          isPreview={true}
          activity={activityPreview}
          isActive={false}
        />
      </div>

      <Container component='main'>
        <CssBaseline />

        <div className={classes.paper}>
          <div className={classes.form}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  csscolor={color.hex}
                  fullWidth
                  id='name'
                  label='Activity Name'
                  name='name'
                  value={name}
                  onChange={e => onChange(e)}
                  error={!!nameError}
                  helperText={nameError && nameError.msg}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor='color'>Color</InputLabel>
                  <Select
                    csscolor={color.hex}
                    value={color}
                    onChange={e => onChange(e)}
                    inputProps={{
                      name: 'color',
                      id: 'color'
                    }}
                    renderValue={color => (
                      <div className={classes.colorSelected} value={color.hex}>
                        <div
                          className={classes.colorPrev}
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </div>
                    )}
                  >
                    {colors.map(color => (
                      <MenuItem key={color.name} value={color}>
                        <div
                          className={classes.colorPrev}
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  csscolor={color.hex}
                  fullWidth
                  value={target}
                  id='target'
                  label='Target'
                  name='target'
                  onChange={e => onChange(e)}
                  helperText='hours : minutes : seconds'
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  component='fieldset'
                  className={classes.formControl}
                >
                  <FormLabel component='legend'>Repeat</FormLabel>
                  <RadioGroup
                    aria-label='repeat'
                    name='repeatWord'
                    value={repeatWord}
                    onChange={e => setRepeats(e.target.value)}
                  >
                    <FormControlLabel
                      value='weekly'
                      control={<Radio color='default' />}
                      label='Weekly'
                    />
                    <FormControlLabel
                      value='daily'
                      control={<Radio color='default' />}
                      label='Daily'
                    />
                    <FormControlLabel
                      value='onDays'
                      control={<Radio color='default' />}
                      label='On days'
                    />
                    <div
                      className={classes.days}
                      style={{
                        opacity: repeatWord === 'onDays' ? '.87' : '.38'
                      }}
                    >
                      {days.map((day, i) => (
                        <div
                          key={i}
                          className={handleDayClass(i)}
                          onClick={() => toggleDay(i)}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  className={classes.earns}
                  value={earns}
                  control={
                    <Switch
                      color='secondary'
                      checked={earns}
                      name='earns'
                      value={earns}
                      onChange={toggleEarns}
                    />
                  }
                  label='Earns break time'
                  labelPlacement='start'
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

EditActivity.propTypes = {
  alerts: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  alerts: state.alerts,
  socket: state.auth.socket,
  activities: state.user.activities,
  isEditingActivity: state.requests.isEditingActivity
});

export default connect(mapStateToProps)(withRouter(EditActivity));
