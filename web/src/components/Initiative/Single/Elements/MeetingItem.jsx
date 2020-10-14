import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import type { PropsType } from 'types/react.type';
import { Button } from 'components/Elements';
import config from 'config';
import type { ReferenceType } from 'types/html.type';
import request from 'services/request';
import Confirm from '../../../Elements/Confirm';
import Guard from '../../../Sytem/Guard';
import Snack from '../../../Alerts/Snack';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  title: {
    fontSize: 14,
    width: '100%',
  },
  body: {
    height: '80px',
    overflow: 'hidden',
    '&.open': {
      height: '100%',
    },
    '&.close': {
      display: 'none',
    },
  },
  name: {
    display: 'inline-block',
    '& p': {
      margin: '0',
      marginBottom: '0.5rem',
    },
  },
  avatar: {
    '& div': {
      width: theme.spacing(3),
      height: theme.spacing(3),
      border: 'none',
      color: theme.palette.secondary.dark,
      fontSize: 14,
    },
  },
}));

export default ({
  meeting, onClickJoin, reload,
}: PropsType) => {
  const classes = useStyles();

  const confirmRef: ReferenceType = useRef(null);
  const alertRef: ReferenceType = useRef(null);

  const [, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [timeDuration, setTimeDuration] = useState();
  const onClickStart = () => {
    setLoading(true);

    request.setContentType('application/json');
    request.put(`${config.services.initiative}/initiatives/start/meeting/${meeting.uuid}`)
      .then(() => {
        setStatus('ongoing');
        onClickJoin(meeting);
        reload();
      }).catch((error: any) => {
        alertRef.current.showAlert(error.message);
      }).finally(() => {
        setLoading(false);
      });
  };

  const onClickCancel = () => {
    setLoading(true);

    request.setContentType('application/json');
    request.put(`${config.services.initiative}/initiatives/cancel/meeting/${meeting.uuid}`)
      .then(() => {
        reload();
      }).catch((error: any) => {
        alertRef.current.showAlert(error.message);
      }).finally(() => {
        setLoading(false);
      });
  };
  const deleteMeeting = () => {
    setLoading(true);

    request.setContentType('application/json');
    return request.delete(`${config.services.initiative}/initiatives/delete/meeting/${meeting.uuid}`)
      .then(() => {
        reload();
      }).catch((error: any) => {
        alertRef.current.showAlert(error.message);
      }).finally(() => {
        setLoading(false);
      });
  };
  const handleMeetingDelete = () => {
    const option: any = {
      title: 'Are you sure you want to delete this meeting ?',
      confirmText: 'Delete',
    };
    confirmRef
      .current
      .open(true, option, () => () => deleteMeeting());
  };

  useEffect(() => {
    if (!meeting?.started_at || meeting.status !== 'ongoing') return () => {};

    const interval = setInterval(() => {
      const now = moment(new Date());
      const from = moment(meeting.started_at);

      const duration = moment.duration(now.diff(from));
      const hours = duration.hours() ? `${duration.hours()}h` : '';
      const minutes = duration.minutes() ? `${duration.minutes()}m` : '';
      const seconds = duration.seconds() ? `${duration.seconds()}s` : '';

      const time = `${hours} ${minutes} ${seconds}`;
      setTimeDuration(time);
    }, 1000);

    return () => {
      clearTimeout(interval);
      setTimeDuration();
    };
  }, [meeting]);

  return (
    <Box>
      <Confirm ref={confirmRef} />
      <Snack ref={alertRef} />
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h6" component="div" noWrap>
            {meeting.name}
          </Typography>
          <Typography variant="body2" component="div" color="textSecondary">
            Date:
            {' '}
            {moment.utc(meeting.date).format('MMMM Do YYYY')}
          </Typography>
          <Typography variant="body2" component="div" color="textSecondary">
            Time:
            {' '}
            {moment.utc(meeting.time).format('hh:mm A')}
          </Typography>
          <Typography variant="body2" component="div" color="textSecondary">
            Status:
            {' '}
            {meeting.status}
            {' '}
          </Typography>
        </CardContent>
        <CardActions>
          <div style={{ width: '100%' }}>
            <Box display="flex">

              <Box flexGrow={1}>
                <AvatarGroup max={4} className={classes.avatar}>
                  {meeting.participants && meeting.participants.map((user: any, index: number) => (
                    <Avatar
                      key={index}
                      alt={user.first_name}
                      src={`${config.services.file}/content/${user.user}?direct=true`}
                    />
                  ))}
                </AvatarGroup>
              </Box>
              <Box display="flex" p={0.7}>
                <Typography variant="body2" component="div" color="textSecondary">
                  {timeDuration}
                </Typography>
              </Box>
              <Box display="flex" pr={1}>

                <Guard requiredPermission="set-initiative-meeting">
                  <Box mr={1}>
                    <Button
                      color="primary"
                      size="small"
                      onClick={handleMeetingDelete}
                    >
                      Delete
                    </Button>
                  </Box>

                  {meeting.status === 'pending' && (
                  <Box mr={1}>
                    <Button
                      color="primary"
                      size="small"
                      onClick={() => onClickCancel(meeting)}
                    >
                      Cancel
                    </Button>
                  </Box>
                  )}
                  {meeting.status === 'pending' && (
                  <Button
                    loading={loading}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onClickStart(meeting)}
                  >
                    Start
                  </Button>
                  )}
                </Guard>
                {meeting.status === 'finished' && (
                  <Box mr={1}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => onClickJoin(meeting)}
                    >
                      View
                    </Button>
                  </Box>
                )}
                {meeting.status === 'ongoing' && (
                <Box mr={1}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onClickJoin(meeting)}
                  >
                    Join
                  </Button>
                </Box>
                )}
              </Box>
            </Box>
          </div>
        </CardActions>
      </Card>
    </Box>
  );
};
