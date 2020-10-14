import React from 'react';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

export default () => (
  <>
    <Box display="flex" flexDirection="row" mt={2} ml={2}>
      <Box>
        <Skeleton variant="circle" width={50} height={50} />
      </Box>
      <Box ml={1}>
        <Skeleton width={500} />
        <Skeleton width={300} />
      </Box>
    </Box>
    <Box display="flex" flexDirection="row" mt={2} ml={2}>
      <Box>
        <Skeleton variant="circle" width={50} height={50} />
      </Box>
      <Box ml={1}>
        <Skeleton width={400} />
        <Skeleton width={200} />
      </Box>
    </Box>
  </>
);
