import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { clearAlerts } from '../../actions/alerts';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { getUnusedColors } from '../../utils/colors';

const CustomTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: props => props.csscolor
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: props => props.csscolor
    }
  }
})(TextField);

const CustomSelect = withStyles({
  root: {
    '& label.Mui-focused': {
      color: props => props.csscolor
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: props => props.csscolor
    }
  }
})(Select);

const useStyles = makeStyles(theme => ({
  exitButton: {
    marginRight: theme.spacing(2)
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
    opacity: '.87'
  },
  day: {
    color: '#ffffff',
    backgroundColor: '#000000',
    height: '2rem',
    width: '2.4rem',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    margin: '.8rem 0 0 .8rem',
    pointerEvents: 'auto'
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

const AddActivity = ({ clearAlerts, alerts, socket, activities, history }) => {
  let colors = getUnusedColors(activities);

  useEffect(() => {
    return () => {
      clearAlerts();
    };
  }, [clearAlerts]);

  const classes = useStyles();

  const days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];

  const [formData, setFormData] = useState({
    name: '',
    color: colors[0],
    target: '00:00:00',
    repeat: 'weekly',
    earns: true
  });

  const { name, color, target, repeat, earns } = formData;

  const nameError = alerts.errors.filter(error => error.param === 'name')[0];

  const handleExit = () => {
    history.push('/activities');
  };

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log('submitted');
  };

  const toggleEarns = () => {
    setFormData(prev => ({ ...prev, earns: !prev.earns }));
  };

  return (
    <React.Fragment>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.exitButton}
            color='inherit'
            aria-label='exit'
            onClick={handleExit}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            Add Activity
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component='main'>
        <CssBaseline />
        <div className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={e => onSubmit(e)}
            autoComplete='off'
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  csscolor={color.hex}
                  fullWidth
                  id='name'
                  label='Name'
                  name='name'
                  value={name}
                  autoFocus
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
                    name='repeat'
                    value={repeat}
                    onChange={e => onChange(e)}
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
                    <div className={classes.days}>
                      {days.map((day, i) => (
                        <div key={i} className={classes.day}>
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
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              className={classes.submit}
            >
              Save
            </Button>
          </form>
        </div>
      </Container>
    </React.Fragment>
  );
};

AddActivity.propTypes = {
  alerts: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  clearAlerts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alerts,
  socket: state.auth.socket,
  activities: state.user.activities
});

export default connect(
  mapStateToProps,
  { clearAlerts }
)(withRouter(AddActivity));
