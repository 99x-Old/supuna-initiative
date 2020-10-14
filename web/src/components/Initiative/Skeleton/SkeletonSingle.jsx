import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import { Box, Typography } from '@material-ui/core';

export default () => (
  <>
    <Grid container spacing={3}>
      <Grid item md={3} xs={12}>
        <Skeleton variant="rect" height={330} style={{ backgroundColor: '#ccc' }} />
        <Skeleton variant="rect" height={50} style={{ backgroundColor: '#999' }} />
        <Box mb={1} />
      </Grid>
      <Grid item md={9}>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Skeleton variant="rect" width={100} height={20} style={{ backgroundColor: '#ccc' }} />
              <Grid item xs={6}>
                <Typography variant="h4" gutterBottom>
                  <Skeleton style={{ backgroundColor: '#ccc' }} />
                </Typography>
                <Typography variant="body1" gutterBottom component="div">
                  <Skeleton style={{ backgroundColor: '#ccc' }} />
                </Typography>
                <Typography variant="body1" gutterBottom component="div">
                  <Skeleton style={{ backgroundColor: '#ccc' }} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>

        </div>
      </Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid item xs={4} />
    </Grid>
  </>
);
