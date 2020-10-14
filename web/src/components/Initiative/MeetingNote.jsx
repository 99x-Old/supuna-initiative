import React, { useEffect, useRef, useState } from 'react';
import Editor from 'components/Editor';
import Socket from 'services/request/socket';
import type { DataInterface } from 'services/request/socket/data.interface';
import { useSelector } from 'react-redux';
import {
  Avatar, Box, Theme, Typography,
} from '@material-ui/core';
import type { StoreType } from 'types/store.type';
import type { PropsType } from 'types/react.type';
import { makeStyles } from '@material-ui/core/styles';
import config from 'config';

const socket = new Socket('meeting');
const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    display: 'inline-block',
    verticalAlign: 'top',
    marginRight: '0.2rem',
  },
  typingBox: {
    position: 'absolute',
    marginTop: '-30px',
  },

}));
export default ({ channel, currentNotes, readOnly }: PropsType) => {
  const classes = useStyles();
  const sectionRef: any = useRef(null);
  const [meetingNote, setMeetingNote]: any = useState('');
  const auth = useSelector((state: StoreType) => state.auth);
  const [typingUser, setTypingUser]: any = useState({});
  const [, setTypingTimeout]: any = useState(null);
  const [notesActive, setNotesActive]: any = useState(true);

  useEffect(() => {
    if (meetingNote.length) {
      const data: DataInterface = {
        channel,
        event: `new-meeting-note-${channel}`,
        data: {
          text: sectionRef.current.getContents(),
          user: auth.user,
        },
      };
      socket.send(data);
    }
  }, [auth, channel, meetingNote]);

  useEffect(() => {
    socket
      .join(channel)
      .listen(`new-meeting-note-${channel}`, async (data: string) => {
        if (sectionRef.current && data?.text?.length) {
          setTypingUser(data.user);
          sectionRef.current.setContents(data?.text);
        }
      });
    return () => {
      socket.disconnect([`new-meeting-note-${channel}`]);
    };
  }, [channel]);

  useEffect(() => {
    if (typingUser.first_name) {
      setNotesActive(false);
      const timeout = setTimeout(() => {
        setTypingUser({});
        setNotesActive(true);
      }, 3000);

      setTypingTimeout((currentTimeOut: string) => {
        clearTimeout(currentTimeOut);
        return timeout;
      });
    }
  }, [typingUser]);

  useEffect(() => {
    if (currentNotes) {
      sectionRef.current.setContents(currentNotes);
    }
  }, [currentNotes]);

  return (
    <Box title={!notesActive ? 'You have to wait until everyone is finished typing!' : ''}>
      <Editor
        ref={sectionRef}
        props={{ readOnly: !notesActive || readOnly }}
        height="9rem"
        placeholder="Meeting note..."
        onTyping={setMeetingNote}
      />
      <Typography variant="subtitle2" display="block">
        {!!typingUser.first_name && (
        <Box mt={1} ml={1} className={classes.typingBox}>
          <Avatar
            alt={typingUser.first_name}
            className={classes.avatar}
            src={`${config.services.file}/content/${typingUser.uuid}?direct=true`}
          />
          {typingUser.first_name}
          {' '}
          {typingUser.last_name}
          {' '}
          typing...
        </Box>
        )}
      </Typography>

    </Box>
  );
};
