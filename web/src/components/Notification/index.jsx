import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from './List';

export default () => (
  <div>
    <Container>
      <Grid container spacing={3}>
        <Grid item md={8}>
          <Grid container spacing={3}>
            <List />
          </Grid>
        </Grid>
      </Grid>
    </Container>

  </div>
);
