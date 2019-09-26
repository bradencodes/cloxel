import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    fill: 'currentColor'
  },

  r1: {
    display: 'flex',
    width: '100%',
    height: 1.15
  },
  tl: {
    display: 'flex',
    width: 1.15,
    height: 1.15
  },
  t: {
    display: 'flex',
    width: '100%',
    height: 1.15
  },
  tr: {
    display: 'flex',
    width: 1.15,
    height: 1.15
  },

  r2: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  l: {
    display: 'flex',
    width: 1.15,
    height: '100%'
  },
  m: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  r: {
    display: 'flex',
    width: 1.15,
    height: '100%'
  },

  r3: {
    display: 'flex',
    width: '100%',
    height: 1.15
  },
  bl: {
    display: 'flex',
    width: 1.15,
    height: 1.15
  },
  b: {
    display: 'flex',
    width: '100%',
    height: 1.15
  },
  br: {
    display: 'flex',
    width: 1.15,
    height: 1.15
  }
}));

const SandTexture = ({ color, width, height, id }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.r1}>
        <div className={classes.tl}>
          <svg width='1.15px' height='1.15px'>
            <defs>
              <pattern
                id={`${id}tl`}
                x='0'
                y='0'
                width='1.15'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path d='M1.15,0V1.15H0A1.14,1.14,0,0,1,1.15,0Z' />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height='1.15px'
              fill={`url(#${id}tl)`}
            />
          </svg>
        </div>
        <div className={classes.t}>
          <svg width={width} height='1.15px'>
            <defs>
              <pattern
                id={`${id}t`}
                x='0'
                y='0'
                width='3'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path d='M1.15,1.15H0V0A1.14,1.14,0,0,1,1.15,1.15Z' />
                <path d='M3,0V1.15H1.85A1.14,1.14,0,0,1,3,0Z' />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width={width}
              height='1.15px'
              fill={`url(#${id}t)`}
            />
          </svg>
        </div>
        <div className={classes.tr}>
          <svg width='1.15px' height='1.15px'>
            <defs>
              <pattern
                id={`${id}tr`}
                x='0'
                y='0'
                width='1.15'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M1.15,1.15H0V0A1.14,1.14,0,0,1,1.15,1.15Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height='1.15px'
              fill={`url(#${id}tr)`}
            />
          </svg>
        </div>
      </div>

      <div className={classes.r2}>
        <div className={classes.l}>
          <svg width='1.15px' height={height}>
            <defs>
              <pattern
                id={`${id}l`}
                x='0'
                y='0'
                width='1.15px'
                height='3px'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M1.15,1.85V3H0A1.14,1.14,0,0,1,1.15,1.85Z'
                  transform='translate(0 0)'
                />
                <path
                  d='M0,0H1.15V1.15A1.14,1.14,0,0,1,0,0Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height={height}
              fill={`url(#${id}l)`}
            />
          </svg>
        </div>
        <div className={classes.m}>
          <svg width={width} height>
            <defs>
              <pattern
                id={`${id}m`}
                x='0'
                y='0'
                width='3'
                height='3'
                patternUnits='userSpaceOnUse'
              >
                <path d='M3,1.15a1.08,1.08,0,0,1-.44-.09,1.08,1.08,0,0,1,.09.44,1.08,1.08,0,0,1-.09.44A1.08,1.08,0,0,1,3,1.85V3H1.85a1.08,1.08,0,0,1,.09-.44,1.08,1.08,0,0,1-.44.09,1.22,1.22,0,0,1-.43-.08A1.15,1.15,0,0,1,1.15,3V3H0V1.83a1.22,1.22,0,0,1,.43.08A1.11,1.11,0,0,1,.35,1.5a1.08,1.08,0,0,1,.09-.44A1.08,1.08,0,0,1,0,1.15V0H1.15a1.08,1.08,0,0,1-.09.44A1.08,1.08,0,0,1,1.5.35a1.08,1.08,0,0,1,.44.09A1.08,1.08,0,0,1,1.85,0H3Z' />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width={width}
              height={height}
              fill={`url(#${id}m)`}
            />
          </svg>
        </div>
        <div className={classes.r}>
          <svg width='1.15px' height={height}>
            <defs>
              <pattern
                id={`${id}r`}
                x='0'
                y='0'
                width='1.15'
                height='3'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M0,1.15V0H1.15A1.14,1.14,0,0,1,0,1.15Z'
                  transform='translate(0 0)'
                />
                <path
                  d='M1.15,3H0V1.85A1.14,1.14,0,0,1,1.15,3Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height={height}
              fill={`url(#${id}r)`}
            />
          </svg>
        </div>
      </div>

      <div className={classes.r3}>
        <div className={classes.bl}>
          <svg width='1.15px' height='1.15px'>
            <defs>
              <pattern
                id={`${id}bl`}
                x='0'
                y='0'
                width='1.15'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M0,0H1.15V1.15A1.14,1.14,0,0,1,0,0Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height='1.15px'
              fill={`url(#${id}bl)`}
            />
          </svg>
        </div>
        <div className={classes.b}>
          <svg width='100%' height='1.15px'>
            <defs>
              <pattern
                id={`${id}b`}
                x='0'
                y='0'
                width='3'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M1.85,0H3V1.15A1.14,1.14,0,0,1,1.85,0Z'
                  transform='translate(0 0)'
                />
                <path
                  d='M0,1.15V0H1.15A1.14,1.14,0,0,1,0,1.15Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='100%'
              height='1.15px'
              fill={`url(#${id}b)`}
            />
          </svg>
        </div>
        <div className={classes.br}>
          <svg width='1.15px' height='1.15px'>
            <defs>
              <pattern
                id={`${id}br`}
                x='0'
                y='0'
                width='1.15'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M0,1.15V0H1.15A1.14,1.14,0,0,1,0,1.15Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height='1.15px'
              fill={`url(#${id}br)`}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SandTexture;
