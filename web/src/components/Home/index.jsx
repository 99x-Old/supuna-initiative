import React, { useCallback, useEffect } from 'react';
import './Home.scss';
import Login from 'components/Login';
import {
  Box, Card, CardContent, Theme, Typography,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import type { StoreType } from 'types/store.type';
import Rating from '@material-ui/lab/Rating';
import { useHistory } from 'react-router-dom';
import Feed from '../Feed';
import UserItem from '../Initiative/ManageUsers/UserItem';
import request from '../../services/request';
import config from '../../config';
import SkeletonUsers from '../Initiative/Skeleton/SkeletonUsers';
import Meeting from '../Initiative/Single/Meeting';

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    margin: 0,
    padding: 0,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'fixed',
    left: 0,
    right: 0,
    zIndex: '999',
    top: '0',
    height: '100%',
  },
  avatar: {
    display: 'inline-block',
    marginLeft: '0.2rem',
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
  logo: {
    height: '35px',
    position: 'absolute',
  },
  title: {
    marginLeft: '80px',
  },
}));

export default ({ location }: any) => {
  const classes = useStyles();
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [status, setStatus] = React.useState({ topUsers: [] });
  const auth = useSelector((state: StoreType) => state.auth);
  const history = useHistory();

  const getStatus = useCallback(() => {
    if (auth?.user?.uuid) {
      request.setContentType('application/json');
      request.get(`${config.services.initiative}/status/${auth?.user?.uuid}`)
        .then((response: ResponseType) => {
          setStatus(response.body);
        }).finally(() => {
        });
    }
  }, [auth]);

  useEffect(() => {
    getStatus();
  }, [getStatus]);

  return (
    <div className="home">
      {auth ? (
        <Grid container spacing={3}>
          <Grid item md={6}>
            <Feed reference="homepage-index" />
          </Grid>
          <Grid item md={6}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Top Contributors</Typography>
              {!status.topUsers.length && (
              <Box className={classes.box}>
                <SkeletonUsers />
              </Box>
              )}
              {status.topUsers.map((rateItem: number, index: number) => (
                <UserItem
                  key={index}
                  onClick={() => {
                    history.push(`/profile/${rateItem._id}`);
                  }}
                  subItem={(
                    <Rating
                      value={rateItem.percent}
                      readOnly
                      precision={0.5}
                    />
)}
                  userId={rateItem._id}
                />
              ))}
            </Box>
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>Upcoming Meetings</Typography>
              <Meeting userId={auth.user.uuid} limit={2} onlyMeetings upComing />
            </Box>
          </Grid>
        </Grid>
      )
        : (
          <Grid container spacing={3} className={classes.background}>
            <Grid item md={6}>
              {!showSignUp
                ? (
                  <Box display="flex" justifyContent="center" className="left-container">
                    <Card style={{ width: 500, display: 'inline-block' }}>
                      <Box p={2}>
                        <CardContent>
                          <Box
                            fontSize={24}
                            fontWeight={500}
                            textAlign="center"
                            mb={2}
                          >
                            <img src="/logo.svg" alt="logo" className={classes.logo} />
                            <span className={classes.title}>Welcome</span>
                          </Box>
                          <Login
                            location={location}
                            onClickSignUp={() => setShowSignUp(true)}
                          />
                        </CardContent>
                      </Box>
                    </Card>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="center" className="left-container">
                    <Card style={{ width: 500, display: 'inline-block' }} p={2}>
                      <Box p={2}>
                        <CardContent>
                          <Box fontSize={24} fontWeight={500} textAlign="center" mb={2}>
                            Sign
                            Up
                          </Box>
                        </CardContent>
                      </Box>
                    </Card>
                  </Box>
                )}
            </Grid>
            <Grid item md={6}>
              <Box display="flex" justifyContent="center" className="right-container">
                <Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      A place to convene and a place for ideas.
                    </Typography>
                    <Box mb={2} />
                    <Typography variant="h6" component="div">
                      Together with you, we co-create
                    </Typography>
                  </Box>
                  <video
                    src="/homepage-video.mp4"
                    autoPlay
                    loop
                    muted
                  >
                    <track kind="captions" />
                  </video>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}

    </div>
  );
};
