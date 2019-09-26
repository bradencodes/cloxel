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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import CloseIcon from '@material-ui/icons/Close';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ActivityCard from './ActivityCard';
import { setAlerts } from '../../actions/alerts';
import { getUnusedColors, stylingColors } from '../../utils/colors';
import { shortTimeToMS } from '../../utils/convert';
import { ADD_ACTIVITY, ACTIVITY_ADDED } from '../../actions/types';
import { addActivityToRedux } from '../../actions/activities';
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
    // position: 'fixed',
    width: '100%',
    padding: theme.spacing(0, 2),
    zIndex: 1,
    backgroundColor: stylingColors.white
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // marginTop: '9rem',
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

const AddActivity = ({
  dispatch,
  alerts,
  socket,
  user,
  activities,
  history,
  isAddingActivity
}) => {
  let colors = getUnusedColors(activities);

  useEffect(() => {
    return () => {
      dispatch(clearAlerts());
    };
  }, [dispatch]);

  const classes = useStyles();

  const days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];

  const [formData, setFormData] = useState({
    name: '',
    color: colors[0],
    target: '00:00:00',
    repeatWord: 'weekly',
    repeatArray: [0],
    earns: true
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
    start: [],
    end: [],
    repeat: correctRepeatArray(repeatArray),
    name,
    color: color.hex,
    displayTarget: shortTimeToMS(target) > 0 ? shortTimeToMS(target) : 0,
    displayProgress: 0,
    adds: earns
  };

  const nameError = alerts.errors.filter(error => error.param === 'name')[0];

  const handleExit = () => {
    if (isAddingActivity) return;
    history.push('/activities');
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSave = async () => {
    if (isAddingActivity) return;

    socket.emit('join room', user._id);
    dispatch({ type: ADD_ACTIVITY });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify(activityPreview);

    try {
      const res = await axios.post(`${urlpre}/api/activities`, body, config);
      let newActivity = res.data;
      socket.emit('add activity', newActivity);
      dispatch(addActivityToRedux(newActivity, user));
      history.push('/activities');
    } catch (err) {
      const errors = err.response.data.errors;
      dispatch({ type: ACTIVITY_ADDED });

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
            disabled={isAddingActivity}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            Add Activity
          </Typography>
          <IconButton
            color='inherit'
            aria-label='save'
            onClick={onSave}
            disabled={isAddingActivity}
          >
            <SaveOutlinedIcon />
          </IconButton>
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

AddActivity.propTypes = {
  alerts: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  alerts: state.alerts,
  socket: state.auth.socket,
  activities: state.user.activities,
  isAddingActivity: state.requests.isAddingActivity
});

export default connect(mapStateToProps)(withRouter(AddActivity));
