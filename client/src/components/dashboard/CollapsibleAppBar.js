import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  appBar: {
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
    transition: 'transform .25s'
  },
  hide: {
    transform: 'translate(0, -70px)',
    transition: 'transform .25s'
  }
}));

const CollapsibleAppBar = props => {
  const classes = useStyles();
  const [show, changeShow] = React.useState(null);

  let lastScroll = null;

  const handleScroll = () => {
    const windowLastScroll = window.scrollY;

    if (windowLastScroll === lastScroll) {
      return;
    }

    const shouldShow =
      lastScroll !== null ? windowLastScroll < lastScroll : null;

    if (shouldShow !== show) {
      changeShow(shouldShow);
    }

    lastScroll = windowLastScroll;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getScrollClassName = () => {
    if (show === null) {
      return '';
    }

    return show ? classes.show : classes.hide;
  };

  return (
    <AppBar
      position='fixed'
      className={`${classes.root} ${getScrollClassName()} ${classes.appBar}`}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={props.handleDrawerOpen}
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
  );
};

CollapsibleAppBar.propTypes = {};

export default CollapsibleAppBar;
