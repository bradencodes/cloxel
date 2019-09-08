import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CircularProgress from '@material-ui/core/CircularProgress';
import { mainListItems, secondaryListItems } from './ListItems';
import { logout } from '../../actions/auth';
import cloxelLogo from '../../resources/cloxelLogo.svg';
import Activities from '../activities.js/Activities';

const drawerWidth = 256;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: 36
  },
  title: {
    flexGrow: 1
  },
  show: {
    transform: 'translate(0, 0)',
    transition: 'transform .22s'
  },
  hideAppBar: {
    transform: 'translate(0, -65px)',
    transition: 'transform .35s'
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 56px)'
    },
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  accountSwitcher: {
    margin: theme.spacing(0, 2, 2)
  },
  signout: {
    cursor: 'pointer',
    display: 'inline',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  progress: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const Dashboard = ({ auth: { loading, user }, logout }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [show, changeShow] = React.useState(true);

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const windowLastScroll = window.scrollY;
      if (!windowLastScroll || Math.abs(windowLastScroll - lastScroll) < 16) {
        return;
      }
      if (windowLastScroll < 76) {
        changeShow(true);
        return;
      }
      const shouldShow = lastScroll !== null && windowLastScroll < lastScroll;
      changeShow(shouldShow);
      lastScroll = windowLastScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getScrollClassName = () => {
    return show ? classes.show : classes.hideAppBar;
  };

  return loading || user === null ? (
    <div className={classes.progress}>
      <img
        src={cloxelLogo}
        alt='cloxelLogo'
        style={{ width: '192px', height: '192px' }}
      />
      <CircularProgress />
    </div>
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='fixed'
        className={`${getScrollClassName()} ${classes.appBar}`}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            className={classes.title}
          >
            Cloxel
          </Typography>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        variant='temporary'
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
        onClose={handleDrawerClose}
        onOpen={handleDrawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div className={classes.accountSwitcher}>
          <Typography variant='h6'>{user.name}</Typography>
          <Typography
            variant='body2'
            className={classes.signout}
            onClick={logout}
          >
            Sign out
          </Typography>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        {/* <Divider /> */}
        <List>{secondaryListItems}</List>
      </SwipeableDrawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Activities show={show} />
      </main>
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Dashboard);
