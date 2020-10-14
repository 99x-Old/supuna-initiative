import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Box, InputLabel, Theme } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import React, {
  forwardRef, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'components/Elements';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Members from 'components/Elements/Members';
import Editor from '../../../Editor';
import request from '../../../../services/request';
import config from '../../../../config';
import UserItem from '../../Year/UserItem';
import type { ProfileType } from '../../../../types/profile.type';
import type { ReferenceType } from '../../../../types/html.type';
import Snack from '../../../Alerts/Snack';

const useStyles = makeStyles((theme: Theme) => ({
  content: {

  },
  label: {
    color: theme.palette.secondary.contrastText,
    marginBottom: '5px',
    fontSize: '0.9rem',
  },
}));

export default forwardRef(({ initiativeId, reload }: PropsType, ref: any) => {
  const classes = useStyles();

  const nameRef: ReferenceType = useRef({});
  const descriptionRef: ReferenceType = useRef({});
  const addiMemberRef: ReferenceType = useRef({});
  const alertRef: ReferenceType = useRef(null);

  const [meetingData, setMeetingData] = React.useState({});

  const [open, setOpen] = React.useState(false);
  const [, setMeetingId] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate]: any = useState(new Date());
  const [time, setTime]: any = useState(new Date());
  const [participants, setParticipants]: any = useState([]);

  const handleDateChange = (value: Date) => {
    setDate(value);
  };
  const handleTimeChange = (value: Date) => {
    setTime(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (meetingItem: any) => {
    setOpen(true);
    setMeetingId(meetingData.uuid);
    setMeetingData(meetingItem);
    setDate(meetingItem.date);
    setTime(meetingItem.time);
  };

  const save = useCallback(() => {
    setLoading(true);

    const name = nameRef.current.getRawContents();
    const description = descriptionRef.current.getContents();
    const participantIds = participants.map((participant: ProfileType) => participant.uuid);

    request.setContentType('application/json');
    request.post(`${config.services.initiative}/initiatives/set/meeting`, {
      name, description, date, time, participants: participantIds, initiative: initiativeId,
    })
      .then(() => {
        handleClose();
        reload();
      }).catch((error: any) => {
        alertRef.current.showAlert(error.message);
      }).finally(() => {
        setLoading(false);
      });
  }, [date, initiativeId, participants, reload, time]);

  const handleAddMember = () => {
    addiMemberRef.current.open();
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
      <Snack ref={alertRef} />
      <Members
        ref={addiMemberRef}
        onSelect={(member: any) => {
          setParticipants((currentParticipants: []) => [...currentParticipants, member]);
        }}
      />
      <DialogTitle>Create a Meeting</DialogTitle>
      <DialogContent className={classes.content}>
        <InputLabel className={classes.label}>Name</InputLabel>
        <Editor placeholder="DSM..." ref={nameRef} contents={meetingData.name} />
        <Box mt={1} />
        <InputLabel className={classes.label}>Description</InputLabel>
        <Editor placeholder="Description..." ref={descriptionRef} height="100px" contents={meetingData.description} />
        <Box mt={1} />
        <Box display="flex" flexDirection="row">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Box mr={1}>
              <InputLabel className={classes.label}>Date</InputLabel>
              <KeyboardDatePicker
                margin="none"
                format="yyyy/MM/dd"
                value={date}
                onChange={handleDateChange}
                InputProps={{
                  disableUnderline: true,
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Box>
            <Box>
              <InputLabel className={classes.label}>Time</InputLabel>
              <KeyboardTimePicker
                margin="none"
                value={time}
                onChange={handleTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </Box>
          </MuiPickersUtilsProvider>
        </Box>
        <Box mt={1} />
        <InputLabel className={classes.label}>
          Participants
          <IconButton className={classes.iconButton} onClick={handleAddMember}>
            <AddCircleIcon className={classes.icon} />
          </IconButton>
        </InputLabel>
        {participants.map((participant: any) => (
          <UserItem key={participant.uuid} user={participant} memberType="" size="5" />
        ))}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={save} loading={loading}>Create</Button>
      </DialogActions>
    </Dialog>
  );
});
