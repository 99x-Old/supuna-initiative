import React, {
  forwardRef, useCallback, useEffect, useImperativeHandle,
} from 'react';
import {
  Avatar, Box, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import type { PropsType } from 'types/react.type';
import config from '../../config';
import { Button } from '../Elements';
import request from '../../services/request';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    overflow: 'hidden',
    minWidth: '500px',
  },
  avatar: {
    marginLeft: '0.2rem',
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  box: {
    width: '33%',
    display: 'inline-block',
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: theme.palette.background.default,
  },

  sub: {
    whiteSpace: 'nowrap',
    width: '10rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export default forwardRef((props: PropsType, ref: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [loading] = React.useState(false);
  const [maxWidth] = React.useState('md');
  const [kudos, setKudos] = React.useState([]);
  const [selectedKudos, setSelectedKudos] = React.useState({});
  const [user, setUser] = React.useState({});

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = (selectedUser: any) => {
    setOpen(true);
    setUser(selectedUser);
  };
  const add = () => {
    request.post(`${config.services.user}/kudos/${selectedKudos.uuid}/${user.uuid}`)
      .then(() => {
        props.onAdd();
      });
    setOpen(false);
  };

  const list = useCallback(() => {
    request.get(`${config.services.user}/kudos`)
      .then((response: ResponseType) => {
        setKudos(response.body);
      });
  }, []);

  useImperativeHandle(ref, () => ({
    open: handleClickOpen,
  }));

  useEffect(() => {
    list();
  }, [list]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={maxWidth}
      >
        <DialogTitle>Select Kudos award</DialogTitle>
        <DialogContent className={classes.content}>
          {kudos.map((kudosItem: any) => (
            <Box
              key={kudosItem.uuid}
              className={`${classes.box} ${selectedKudos.uuid === kudosItem.uuid ? classes.selected : ''}`}
              onClick={() => {
                setSelectedKudos(kudosItem);
              }}
            >
              <Box display="flex" flexDirection="row" p={1}>
                <Box>
                  <Avatar variant="square" className={classes.avatar} src={`${config.services.file}/content/${kudosItem.uuid}?direct=true`} />
                </Box>
                <Box ml={1}>
                  <Typography variant="subtitle1" display="block" gutterBottom>
                    {kudosItem.kudos}
                  </Typography>
                  <Typography variant="body2" display="block" gutterBottom className={classes.sub}>
                    {kudosItem.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">Close</Button>
          <Button
            color="primary"
            loading={loading}
            onClick={add}
            disabled={!selectedKudos.uuid}
            variant="contained"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
