import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    fill: '#ffffff'
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

const InverseSandTexture = ({ width, height }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.r1}>
        <div className={classes.tl}>
          <svg width='1.15px' height='1.15px'>
            <defs>
              <pattern
                id={`tl`}
                x='0'
                y='0'
                width='1.15'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path d='M0,1.15V0H1.15A1.14,1.14,0,0,0,0,1.15Z' />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height='1.15px'
              fill={`url(#tl)`}
            />
          </svg>
        </div>
        <div className={classes.t}>
          <svg width={width} height='1.15px'>
            <defs>
              <pattern
                id={`t`}
                x='0'
                y='0'
                width='3'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path d='M0,0H3A1.14,1.14,0,0,0,1.85,1.15h-.7A1.14,1.14,0,0,0,0,0Z' />
              </pattern>
            </defs>
            <rect x='0' y='0' width={width} height='1.15px' fill={`url(#t)`} />
          </svg>
        </div>
        <div className={classes.tr}>
          <svg width='1.15px' height='1.15px'>
            <defs>
              <pattern
                id={`tr`}
                x='0'
                y='0'
                width='1.15'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M0,0H1.15V1.15A1.14,1.14,0,0,0,0,0Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height='1.15px'
              fill={`url(#tr)`}
            />
          </svg>
        </div>
      </div>

      <div className={classes.r2}>
        <div className={classes.l}>
          <svg width='1.15px' height={height}>
            <defs>
              <pattern
                id={`l`}
                x='0'
                y='0'
                width='1.15px'
                height='3px'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M0,3V0A1.14,1.14,0,0,0,1.15,1.15v.7A1.14,1.14,0,0,0,0,3Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect x='0' y='0' width='1.15px' height={height} fill={`url(#l)`} />
          </svg>
        </div>
        <div className={classes.m}>
          <svg width={width} height>
            <defs>
              <pattern
                id={`m`}
                x='0'
                y='0'
                width='3'
                height='3'
                patternUnits='userSpaceOnUse'
              >
                <path d='M1.94.44A1.08,1.08,0,0,0,1.5.35a1.08,1.08,0,0,0-.44.09A1.08,1.08,0,0,0,1.15,0h.7A1.08,1.08,0,0,0,1.94.44Z' />
                <path d='M3,1.15v.7a1.08,1.08,0,0,0-.44.09,1.08,1.08,0,0,0,.09-.44,1.08,1.08,0,0,0-.09-.44A1.08,1.08,0,0,0,3,1.15Z' />
                <path d='M1.94,2.56A1.08,1.08,0,0,0,1.85,3h-.7V3a1.15,1.15,0,0,0-.08-.41,1.22,1.22,0,0,0,.43.08A1.08,1.08,0,0,0,1.94,2.56Z' />
                <path d='M.35,1.5a1.11,1.11,0,0,0,.08.41A1.22,1.22,0,0,0,0,1.83V1.15a1.08,1.08,0,0,0,.44-.09A1.08,1.08,0,0,0,.35,1.5Z' />
              </pattern>
            </defs>
            <rect x='0' y='0' width={width} height={height} fill={`url(#m)`} />
          </svg>
        </div>
        <div className={classes.r}>
          <svg width='1.15px' height={height}>
            <defs>
              <pattern
                id={`r`}
                x='0'
                y='0'
                width='1.15'
                height='3'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M1.15,0V3A1.14,1.14,0,0,0,0,1.85v-.7A1.14,1.14,0,0,0,1.15,0Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect x='0' y='0' width='1.15px' height={height} fill={`url(#r)`} />
          </svg>
        </div>
      </div>

      <div className={classes.r3}>
        <div className={classes.bl}>
          <svg width='1.15px' height='1.15px'>
            <defs>
              <pattern
                id={`bl`}
                x='0'
                y='0'
                width='1.15'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M1.15,1.15H0V0A1.14,1.14,0,0,0,1.15,1.15Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height='1.15px'
              fill={`url(#bl)`}
            />
          </svg>
        </div>
        <div className={classes.b}>
          <svg width='100%' height='1.15px'>
            <defs>
              <pattern
                id={`b`}
                x='0'
                y='0'
                width='3'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M3,1.15H0A1.14,1.14,0,0,0,1.15,0h.7A1.14,1.14,0,0,0,3,1.15Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect x='0' y='0' width='100%' height='1.15px' fill={`url(#b)`} />
          </svg>
        </div>
        <div className={classes.br}>
          <svg width='1.15px' height='1.15px'>
            <defs>
              <pattern
                id={`br`}
                x='0'
                y='0'
                width='1.15'
                height='1.15'
                patternUnits='userSpaceOnUse'
              >
                <path
                  d='M1.15,0V1.15H0A1.14,1.14,0,0,0,1.15,0Z'
                  transform='translate(0 0)'
                />
              </pattern>
            </defs>
            <rect
              x='0'
              y='0'
              width='1.15px'
              height='1.15px'
              fill={`url(#br)`}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default InverseSandTexture;
