import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import { AddActivityIcon, AddsIcon } from '../../resources/mySvgIcons';
import InverseSandTexture from '../util/InverseSandTexture';

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(2, 0, 0),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  actions: {
    display: 'flex',
    alignItems: 'center'
  },
  addActivityIcon: {
    width: '2.57rem',
    height: '2.57rem',
    margin: `8px 8px`,
    color: 'rgba(0, 0, 0, 0.38)'
  },
  name: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontWeight: 'bold',
    fontSize: '3.0rem',
    width: '100%'
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    marginBottom: -4
  },
  timeText: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontSize: '1.8rem',
    fontWeight: '500'
  },
  timeIcon: {
    margin: `-4px 4px`,
    color: 'rgba(0, 0, 0, 0.20)'
  },
  repeatText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    lineHeight: '1rem',
    marginLeft: 8
  },
  bars: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  progressBar: {
    height: '.83rem'
  },
  breaktimeBar: {
    width: '100%',
    height: '.23rem',
    backgroundColor: 'rgba(0, 0, 0, 0.38)'
  }
}));

const AddActivityCard = ({ history }) => {
  const classes = useStyles();

  const handleClick = () => {
    history.push('/activities/create');
  };

  return (
    <Card className={classes.card} elevation='1'>
      <CardActionArea onClick={handleClick}>
        <div className={classes.actions}>
          <AddActivityIcon className={classes.addActivityIcon} />
          <Typography className={classes.name}>Add Activity</Typography>
        </div>

        <div className={classes.time}>
          <Typography
            className={classes.timeText}
            style={{ fontWeight: '500' }}
          >
            00:00:00
            <AddsIcon className={classes.timeIcon} />
          </Typography>
          <Typography
            className={classes.timeText}
            style={{ fontWeight: 'bold', textAlign: 'right' }}
          >
            / 00:00:00
            <span className={classes.repeatText}>PER WEEK</span>
          </Typography>
        </div>

        <div className={classes.bars}>
          <div className={classes.progressBar} />
          <div className={classes.breaktimeBar}>
            <InverseSandTexture />
          </div>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default withRouter(AddActivityCard);
