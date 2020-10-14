import React from 'react';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

export default () => (
  <Box display="flex" flexDirection="row" p={1} m={1}>
    <Box>
      <Skeleton variant="rect" width={80} height={80} />
    </Box>
    <Box ml={1}>
      <Skeleton width={200} />
      <Skeleton width={200} />
      <Skeleton width={200} />
    </Box>
  </Box>
);
