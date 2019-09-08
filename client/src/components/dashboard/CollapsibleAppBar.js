import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  root: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: 10
  },
  menuButton: {
    marginRight: 36
  },
  title: {
    flexGrow: 1
  },
  show: {
    transform: 'translate(0, 0)',
    transition: 'transform .25s',
  },
  hide: {
    transform: 'translate(0, -70px)',
    transition: 'transform .25s',
  },
};

class CollapsibleAppBar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      shouldShow: null,
    };

    this.lastScroll = null;

    this.handleScroll = this.handleScroll.bind(this);
    // Alternatively, you can throttle scroll events to avoid
    // updating the state too often. Here using lodash.
    // this.handleScroll = _.throttle(this.handleScroll.bind(this), 100);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const lastScroll = window.scrollY;

    if (lastScroll === this.state.lastScroll) {
      return;
    }

    const shouldShow =
      this.lastScroll !== null ? lastScroll < this.lastScroll : null;

    if (shouldShow !== this.state.shouldShow) {
      this.setState(prevState => ({
        ...prevState,
        shouldShow,
      }));
    }

    this.lastScroll = lastScroll;
  }

  getScrollClassName() {
    if (this.state.shouldShow === null) {
      return '';
    }

    return this.state.shouldShow
      ? this.props.classes.show
      : this.props.classes.hide;
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar
        position="fixed"
        className={`${classes.root} ${this.getScrollClassName()} ${classes.appBar}`}
      >
        <Toolbar className={classes.toolbar}>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={this.props.handleDrawerOpen}
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
  }
}

CollapsibleAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CollapsibleAppBar);
