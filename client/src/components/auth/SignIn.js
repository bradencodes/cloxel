import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
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

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = ({ login, clearAlerts, isAuthenticated, alerts }) => {
  useEffect(() => {
    return () => {
      clearAlerts();
    };
  }, [clearAlerts]);

  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const emailError = alerts.errors.filter(error => error.param === 'email')[0];
  const passwordError = alerts.errors.filter(
    error => error.param === 'password'
  )[0];

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
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
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={e => onSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                variant='filled'
                autoFocus
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
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link component={RouterLink} to='/register' variant='body2'>
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  clearAlerts: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  alerts: state.alerts
});

export default connect(
  mapStateToProps,
  { login, clearAlerts }
)(Login);
