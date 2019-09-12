import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { clearAlerts } from '../../actions/alerts';
import PropTypes from 'prop-types';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import cloxelLogo from '../../resources/cloxelLogo.svg';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { getUnusedColors } from '../../utils/colors';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(8, 0),
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
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const AddActivity = ({
  login,
  clearAlerts,
  isAuthenticated,
  alerts,
  socket,
  activities
}) => {
  let colors = getUnusedColors(activities);

  useEffect(() => {

    return () => {
      clearAlerts();
    };
  }, [clearAlerts]);

  const classes = useStyles();

  const [formData, setFormData] = useState({
    name: '',
    color: colors[0],
    target: [],
    repeat: [],
    earns: true
  });

  const { name, color, target, repeat, earns } = formData;

  const nameError = alerts.errors.filter(error => error.param === 'name')[0];

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    // login(email, password, socket);
    console.log('submitted');
  };

  return (
    <Container component='main'>
      <CssBaseline />
      <div className={classes.paper}>
        <form
          className={classes.form}
          onSubmit={e => onSubmit(e)}
          autoComplete='off'
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='name'
                label='Name'
                name='name'
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
                  value={color}
                  onChange={e => onChange(e)}
                  inputProps={{
                    name: 'color',
                    id: 'color'
                  }}
                  renderValue={color => (
                      <div
                        className={classes.colorSelected}
                        value={color.hex}
                      >
                        <div
                          className={classes.colorPrev}
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </div>
                    )
                  }
                >
                  {colors.map(color => (
                    <MenuItem
                      key={color.name}
                      value={color}
                    >
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
                fullWidth
                id='color'
                label='Color'
                name='color'
                onChange={e => onChange(e)}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Save
          </Button>
        </form>
      </div>
    </Container>
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
)(AddActivity);
