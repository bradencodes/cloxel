import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { stylingColors } from '../../utils/colors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    backgroundColor: stylingColors.white
  },
  paper: {
    margin: theme.spacing(4),
    width: '100%',
    maxWidth: 500,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  code: {
    marginTop: theme.spacing(4)
  },
  button: {
    marginTop: theme.spacing(4)
  }
}));

const CatchAll = ({ history }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant='h1' className={classes.code}>
          404
        </Typography>
        <Typography variant='h4'>Page not found</Typography>
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={() => history.push('/activities')}
        >
          Return to Cloxel
        </Button>
      </Paper>
    </div>
  );
};

export default withRouter(CatchAll);
