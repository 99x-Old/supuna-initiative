import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';

export default () => (
  <>
    <Grid container spacing={3}>
      <Grid item md={12}>
        <div>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <Grid item md={12}>
                <Box p={1}>
                  <Skeleton style={{ backgroundColor: '#ccc' }} />
                  <Skeleton style={{ backgroundColor: '#ccc', width: '80%' }} />
                  <Skeleton style={{ backgroundColor: '#ccc', width: '70%' }} />
                </Box>
              </Grid>
            </Grid>
          </Grid>

        </div>
      </Grid>
    </Grid>
  </>
);
