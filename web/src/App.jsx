import { Provider } from 'react-redux';
import { Container, Typography } from '@material-ui/core';
import React from 'react';
import store from './stores';
import Boundary from './components/Sytem/Boundary';
import Router from './router';

export default () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Provider store={store}>
    <Boundary>
      <Typography component="div">
        <Container maxWidth={false}>
          <Router />
        </Container>
      </Typography>
    </Boundary>
  </Provider>
);
