import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Box } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import React, {
  forwardRef, useCallback, useImperativeHandle, useState,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from 'components/Elements';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';
import request from 'services/request';
import config from 'config';
import type { PropsType } from 'types/react.type';
import Viewer from 'components/Elements/Viewer';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import MeetingNote from '../../MeetingNote';
import Feed from '../../../Feed';
import Guard from '../../../Sytem/Guard';

const useStyles = makeStyles((theme: Theme) => ({
  content: {},
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

export default forwardRef(({ reload }: PropsType, ref: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [meeting, setMeeting] = React.useState({});

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const getMeeting = useCallback((id: string) => {
    setLoading(true);

    request.setContentType('application/json');
    request.get(`${config.services.initiative}/initiatives/get/meeting/${id}`)
      .then((response: ResponseType) => {
        setMeeting(response.body);
      }).catch(() => {

      }).finally(() => {
        setLoading(false);
      });
  }, []);

  const finish = useCallback(() => {
    setLoading(true);

    request.setContentType('application/json');
    request.put(`${config.services.initiative}/initiatives/finish/meeting/${meeting.uuid}`)
      .then(() => {
        reload();
        handleClose();
      }).catch(() => {

      }).finally(() => {
        setLoading(false);
      });
  }, [meeting.uuid, reload]);

  const handleClickOpen = (meetingData: any) => {
    setOpen(true);
    setMeeting(meetingData);
    getMeeting(meetingData.uuid);
  };

  useImperativeHandle(ref, () => ({
    open: handleClickOpen,
  }));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{meeting.name}</DialogTitle>
      <DialogContent className={classes.content}>
        <Scrollbars
          autoHeight
          autoHeightMin="350px"
          autoHeightMax="700px"
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={1000}
        >
          <Box pr={2}>
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
            <Box mt={2} />
            <Typography variant="body1" component="div" color="textSecondary">
              <Viewer escapeHtml={false} source={meeting.description} />
            </Typography>
            <MeetingNote
              channel={meeting.uuid}
              currentNotes={meeting.notes}
              readOnly={meeting.finished_at}
            />
            <Box m={1} />
            <Feed reference={meeting.uuid} placeholder="Comments..." />
          </Box>
        </Scrollbars>
      </DialogContent>
      <DialogActions>
        <div style={{ width: '100%' }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <AvatarGroup max={4} className={classes.avatar}>
                {meeting.participants && meeting.participants.map((user: any, index: number) => (
                  <Avatar
                    key={index}
                    alt={user.first_name}
                    src={`${config.services.file}/content/${user}?direct=true`}
                  />
                ))}
              </AvatarGroup>
            </Box>
            <Box display="flex" pr={1}>
              <Box mr={1}>
                <Guard requiredPermission="set-initiative-meeting">
                  <Button variant="contained" color="primary" onClick={finish} loading={loading}>End Meeting</Button>
                </Guard>
              </Box>
            </Box>
          </Box>
        </div>
      </DialogActions>
    </Dialog>
  );
});
