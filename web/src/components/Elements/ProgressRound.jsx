import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import type { PropsType } from 'types/react.type';

const CircularProgressWithLabel = (props: PropsType) => {
  const { value } = props;

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="static" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="body2" component="div" color="textSecondary">
          {`${Math.round(
            value,
          )}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ({ progress = 0 }: PropsType) => <CircularProgressWithLabel value={progress} />;
