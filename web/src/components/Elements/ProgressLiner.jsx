import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import type { PropsType } from 'types/react.type';
import LinearProgress from '@material-ui/core/LinearProgress';

const LinearProgressWithLabel = (props: PropsType) => {
  const { value } = props;

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {`${Math.round(
            value,
          )}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ({ progress = 0 }: PropsType) => <LinearProgressWithLabel value={progress} />;
