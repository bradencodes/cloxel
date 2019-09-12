import React from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(2, 0, 0),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    margin: '-4px -4px -8px'
  },
  add: {
    color: 'rgba(0, 0, 0, 0.38)',
    margin: 12
  },
  name: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontWeight: 'bold',
    fontSize: '3.0rem',
    width: '100%',
    marginLeft: -8
  },
  time: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    marginBottom: -4
  },
  times: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: theme.spacing(1)
  },
  timeText: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontSize: '2rem',
    fontWeight: '500'
  },
  repeatContainer: {
    fontWeight: 'bold',
    width: '4.7rem',
    lineHeight: '0',
    textAlign: 'center'
  },
  repeatText: {
    fontSize: '1rem',
    fontWeight: '600',
    lineHeight: '1rem'
  },
  bars: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  progressBar: {
    height: '1.2rem'
  },
  breaktimeBar: {
    width: '100%',
    height: '.6rem',
    backgroundColor: 'rgba(0, 0, 0, 0.38)'
  }
}));

const AddActivityCard = ({ history }) => {
  const classes = useStyles();

  const handleClick = () => {
    history.push('/activities/create');
  };

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={handleClick}>
        <div className={classes.actions}>
          <AddCircleOutlineOutlinedIcon className={classes.add} />
          <Typography variant='h5' className={classes.name}>
            Add Activity
          </Typography>
        </div>

        <div className={classes.time}>
          <div className={classes.times}>
            <Typography className={classes.timeText}>00:00:00</Typography>
            <Typography className={classes.timeText}>00:00:00</Typography>
          </div>
          <div className={classes.repeatContainer}>
            <Typography variant='caption' className={classes.repeatText} />
          </div>
        </div>

        <div className={classes.bars}>
          <div className={classes.progressBar} />
          <div className={classes.breaktimeBar} />
        </div>
      </CardActionArea>
    </Card>
  );
};

export default withRouter(AddActivityCard);
