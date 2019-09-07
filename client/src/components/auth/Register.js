import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setAlerts, clearAlerts } from '../../actions/alerts';
import { register } from '../../actions/auth';
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

const useStyles = makeStyles(theme => ({
  paper: {
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2, 0, 8)
    },
    margin: theme.spacing(8, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    // maxWidth: 600,
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Register = ({
  setAlerts,
  clearAlerts,
  register,
  isAuthenticated,
  alerts
}) => {
  useEffect(() => {
    return () => {
      clearAlerts();
    };
  }, [clearAlerts]);

  const classes = useStyles();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  const nameError = alerts.errors.filter(error => error.param === 'name')[0];
  const emailError = alerts.errors.filter(error => error.param === 'email')[0];
  const passwordError = alerts.errors.filter(
    error => error.param === 'password'
  )[0];
  const password2Error = alerts.errors.filter(
    error => error.param === 'password2'
  )[0];

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlerts({
        errors: [{ msg: 'Passwords do not match', param: 'password2' }]
      });
    } else {
      register({ name, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/activities' />;
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <img
          src={cloxelLogo}
          alt='cloxelLogo'
          style={{ width: '96px', height: '96px' }}
        />
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={e => onSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete='fname'
                name='name'
                fullWidth
                id='name'
                label='Name'
                variant='filled'
                autoFocus
                onChange={e => onChange(e)}
                error={!!nameError}
                helperText={nameError && nameError.msg}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                variant='filled'
                onChange={e => onChange(e)}
                error={!!emailError}
                helperText={emailError && emailError.msg}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                variant='filled'
                onChange={e => onChange(e)}
                error={!!passwordError}
                helperText={passwordError && passwordError.msg}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name='password2'
                label='Verify Password'
                type='password'
                id='password2'
                autoComplete='current-password'
                variant='filled'
                onChange={e => onChange(e)}
                error={!!password2Error}
                helperText={password2Error && password2Error.msg}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link component={RouterLink} to='/signin' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

Register.propTypes = {
  setAlerts: PropTypes.func.isRequired,
  clearAlerts: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  alerts: state.alerts
});

export default connect(
  mapStateToProps,
  { setAlerts, clearAlerts, register }
)(Register);
