import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Home from './components/Home';
import Profile from './components/Profile';
import Manage from './components/Initiative';
import Initiative from './components/Initiative/Single';
import View from './components/Initiative/Single/View';
import Auth from './components/Middleware/Auth';
import Navbar from './components/Navbar';
import Notification from './components/Notification';

export default () => (
  <BrowserRouter>
    <Auth anonymous>
      <Navbar />
      <Container style={{ marginTop: 100 }}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile/:id" component={Profile} />
          <Route exact path="/profile/:id/:tab?" component={Profile} />
          <Auth>
            <Route exact path="/profile/:id?/:tab?" component={Profile} />
            <Route exact path="/manage/:main?/:sub?" component={Manage} />
            <Route exact path="/initiative" component={Initiative} />
            <Route exact path="/initiative/:id/:sub?" component={View} />
            <Route exact path="/notification" component={Notification} />
          </Auth>
        </Switch>
      </Container>
    </Auth>
  </BrowserRouter>
);
