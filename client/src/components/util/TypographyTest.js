import React from 'react';
import Typography from '@material-ui/core/Typography';
import InverseSandTexture from './InverseSandTexture';

const TypographyTest = props => {
  return (
    <div style={{ margin: '80px' }}>
      <Typography variant='h1'>Abcdefg H1</Typography>
      <Typography variant='h2'>Abcdefg H2</Typography>
      <Typography variant='h3'>Abcdefg H3</Typography>
      <Typography variant='h4'>Abcdefg H4</Typography>
      <Typography variant='h5'>Abcdefg H5</Typography>
      <Typography variant='h6'>Abcdefg H6</Typography>
      <Typography variant='subtitle1'>Abcdefg subtitle1</Typography>
      <Typography variant='subtitle2'>Abcdefg subtitle2</Typography>
      <Typography variant='body1'>Abcdefg body1</Typography>
      <Typography variant='body2'>Abcdefg body2</Typography>
      <Typography variant='caption'>Abcdefg caption</Typography>
      <div className=''></div>
      <Typography variant='button'>Abcdefg button</Typography>
      <div className=''></div>
      <Typography variant='overline'>Abcdefg overline</Typography>

      <div
        style={{
          width: 'calc(2 * 1.15px + 30px)',
          height: 'calc(2 * 1.15px + 30px)'
        }}
      >
        <InverseSandTexture color='#fd8411' width='100%' height='100%' />
      </div>
    </div>
  );
};

export default TypographyTest;
