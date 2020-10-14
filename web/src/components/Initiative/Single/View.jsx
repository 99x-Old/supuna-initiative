import React, {
  Suspense, useCallback, useEffect, useRef, useState,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  withStyles,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useHistory } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import { useSelector } from 'react-redux';
import ProfileSkeleton from '../Skeleton';
import Feed from './Feed';
import Meeting from './Meeting';
import type { PropsType } from '../../../types/react.type';
import request from '../../../services/request';
import config from '../../../config';
import Viewer from '../../Elements/Viewer';
import Members from './Members';
import Actions from './Actions';
import Overview from './Overview';
import Skeleton from '../Skeleton/SkeletonSingle';
import { Button } from '../../Elements';
import type { StoreType } from '../../../types/store.type';
import Confirm from '../../Elements/Confirm';
import type { ReferenceType } from '../../../types/html.type';
import Snackbar from '../../Shared/Snackbar';
import Uploader from '../../Uploader';
import type { ErrorResponseType } from '../../../types/response.type';

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

const TabPanel = (props: any) => {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div {...other}>
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  media: {
    height: 330,
  },
  card: {
    width: 300,
  },
  cardContent: {
    paddingBottom: 0,
  },
  uploader: {},
});

export default (props: PropsType) => {
  const { match, location }: any = props;
  const confirmRef: ReferenceType = useRef(null);
  const snackRef: any = useRef(null);
  const uploadRef: any = useRef(null);

  const history = useHistory();
  const classes = useStyles();

  const auth = useSelector((state: StoreType) => state.auth);

  const [selectedTab, setSelectedTab] = useState(0);
  const [tabs] = useState(['overview', 'wall', 'actions', 'meetings', 'members']);
  const [initiative, setInitiative] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [loadingJoin, setLoadingJoin] = React.useState(false);
  const [isJoined, setIsJoined] = React.useState(false);
  const [uploader:boolean, setUploader]: any = useState(false);
  const [loader, setLoader]: any = useState(false);

  const openUploader = () => {
    setUploader(true);
  };

  const closeUploader = () => {
    setUploader(false);
  };

  const onChangeTab = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  const changeTabs = (event: any, tabIndex: number) => {
    if (tabIndex !== null) {
      history.push(`/initiative/${match.params.id}/${tabs[tabIndex]}`);
      onChangeTab(tabIndex);
    }
  };

  const getInitiative = useCallback((initiativeId: string) => {
    setLoading(true);
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/initiatives/${initiativeId}`)
      .then((response: ResponseType) => {
        setInitiative(response.body);
        setIsJoined(response.body.members.includes(auth.user.uuid));
      }).catch(() => {
        history.push('/initiative');
      }).finally(() => {
        setLoading(false);
      });
  }, [auth.user.uuid, history]);

  const joinInitiative = useCallback((initiativeId: string) => {
    request.setContentType('application/json');
    setLoadingJoin(true);
    request.post(`${config.services.initiative}/initiatives/join/${initiativeId}`)
      .then(() => {
        setIsJoined(true);
      }).finally(() => {
        setLoadingJoin(false);
      });
  }, []);

  const leaveInitiative = useCallback((initiativeId: string) => {
    const option: any = {
      title: 'Are you sure you want to leave ?',
      confirmText: 'Leave',
    };
    confirmRef
      .current
      .open(true, option, () => () => {
        request.setContentType('application/json');
        return request.delete(`${config.services.initiative}/initiatives/leave/${initiativeId}`)
          .then(() => {
            setIsJoined(false);
          });
      });
  }, []);

  const upload = () => {
    setLoader(true);
    uploadRef.current.upload(initiative.uuid)
      .then(() => {
        closeUploader();
        setLoader(false);
      }).catch((error: ErrorResponseType) => {
        setLoader(false);
        snackRef.current.show(error.message);
      });
  };

  useEffect(() => {
    const initiativeId = match.params.id;
    getInitiative(initiativeId);
  }, [getInitiative, match.params.id]);

  useEffect(() => {
    const { sub } = match.params;
    onChangeTab(tabs.indexOf(sub) === -1 ? 0 : tabs.indexOf(sub));
  }, [match, match.params, props, tabs]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Snackbar ref={snackRef} />
      <Confirm ref={confirmRef} />
      <Grid container spacing={3}>
        <Grid item md={3}>

          <Card>
            <CardMedia
              onClick={openUploader}
              className={classes.media}
              title={initiative.name}
              image={`${config.services.file}/content/${initiative.uuid}?direct=true&ss`}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5">{initiative.name}</Typography>
              <Typography variant="body2" color="textSecondary" component="div"><Viewer escapeHtml={false} source={initiative.description} /></Typography>
            </CardContent>
            <CardActions>
              <Grid container alignItems="center">
                <Grid item md={10}>
                  {isJoined ? (
                    <Button
                      color="default"
                      variant="contained"
                      onClick={() => leaveInitiative(initiative.uuid)}
                      loading={loadingJoin}
                    >
                      Leave
                    </Button>
                  ) : (
                    <Button
                      onClick={() => joinInitiative(initiative.uuid)}
                      color="primary"
                      variant="contained"
                    >
                      Join
                    </Button>
                  )}
                </Grid>
                <Grid item md={2}>
                  <Box display="flex" flexDirection="row-reverse">
                    <IconButton color="default" />
                  </Box>
                </Grid>
              </Grid>
            </CardActions>
            <Dialog
              fullWidth
              maxWidth="sm"
              open={uploader}
              onClose={closeUploader}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="form-dialog-title">Change Profile Picture</DialogTitle>
              <DialogContent style={{ overflow: 'hidden' }} className={classes.uploader}>
                <Uploader ref={uploadRef} file="https://via.placeholder.com/300x330" />
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={closeUploader}>
                  Close
                </Button>
                <Button loading={loader} color="primary" onClick={upload}>
                  Change
                </Button>
              </DialogActions>
            </Dialog>
          </Card>

        </Grid>
        <Grid item md={9}>
          <div>
            <Grid item xs={12}>
              <div>
                <Box mt={1}>
                  <StyledToggleButtonGroup
                    size="small"
                    value={selectedTab}
                    exclusive
                    onChange={changeTabs}
                    aria-label="text alignment"
                  >
                    <ToggleButton value={0} aria-label="left aligned">
                      Overview
                    </ToggleButton>
                    <ToggleButton value={1} aria-label="centered">
                      Wall
                    </ToggleButton>
                    <ToggleButton value={2} aria-label="centered">
                      Actions
                    </ToggleButton>
                    <ToggleButton value={3} aria-label="centered">
                      Meetings
                    </ToggleButton>
                    <ToggleButton value={4} aria-label="centered">
                      Members
                    </ToggleButton>
                  </StyledToggleButtonGroup>
                </Box>
                <TabPanel value={selectedTab} index={0}>
                  <Overview initiative={initiative} />
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                  <Feed initiative={initiative} />
                </TabPanel>
                <TabPanel value={selectedTab} index={2}>
                  <Actions initiativeId={match.params.id} location={location} />
                </TabPanel>
                <TabPanel value={selectedTab} index={3}>
                  <Meeting initiativeId={match.params.id} />
                </TabPanel>
                <TabPanel value={selectedTab} index={4}>
                  <Members initiativeId={match.params.id} />
                </TabPanel>
              </div>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </Suspense>
  );
};
