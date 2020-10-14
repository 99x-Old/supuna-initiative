import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

export default () => (
  <>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div>
          <GridList cellHeight={300} cols={5} spacing={10}>
            <GridListTile style={{ width: '200px' }}>
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
            <GridListTile style={{ width: '200px' }}>
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
        </div>
      </Grid>
    </Grid>
  </>
);
