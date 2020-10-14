import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { Box, Typography } from '@material-ui/core';

export default () => (
  <>
    <Grid container spacing={3}>
      <Grid item md={3} xs={12}>
        <Skeleton variant="rect" height={330} style={{ backgroundColor: '#ccc' }} />
        <Skeleton variant="rect" height={50} style={{ backgroundColor: '#999' }} />
        <Box mb={1} />
        <Skeleton variant="rect" width={100} height={20} style={{ backgroundColor: '#ccc' }} />
        <Box mb={1} />
        <Skeleton variant="rect" width="300" height={300} style={{ backgroundColor: '#ccc' }} />
      </Grid>
      <Grid item md={9} xs={12}>
        <div>
          <GridList cellHeight={330} cols={4} spacing={10}>
            <GridListTile>
              <Skeleton
                variant="rect"
                width="300"
                height={330}
                style={{ backgroundColor: '#ccc' }}
              />
              <GridListTileBar
                title={<Skeleton />}
                subtitle={<Skeleton />}
              />
            </GridListTile>
            <GridListTile>
              <Skeleton
                variant="rect"
                width="300"
                height={330}
                style={{ backgroundColor: '#ccc' }}
              />
              <GridListTileBar
                title={<Skeleton />}
                subtitle={<Skeleton />}
              />
            </GridListTile>
            <GridListTile>
              <Skeleton
                variant="rect"
                width="300"
                height={330}
                style={{ backgroundColor: '#ccc' }}
              />
              <GridListTileBar
                title={<Skeleton />}
                subtitle={<Skeleton />}
              />
            </GridListTile>
            <GridListTile>
              <Skeleton
                variant="rect"
                width="300"
                height={330}
                style={{ backgroundColor: '#ccc' }}
              />
              <GridListTileBar
                title={<Skeleton />}
                subtitle={<Skeleton />}
              />
            </GridListTile>
          </GridList>
          <Box mb={3} />

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Skeleton variant="rect" width={100} height={20} style={{ backgroundColor: '#ccc' }} />
              <Box mb={1} />
              <Skeleton style={{ backgroundColor: '#ccc' }} height={330} variant="rect" />

            </Grid>
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

        </div>
      </Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid item xs={4} />
    </Grid>
  </>
);
