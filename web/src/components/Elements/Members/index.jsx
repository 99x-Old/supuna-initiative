import React, {
  forwardRef, useCallback, useEffect, useImperativeHandle, useRef,
} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  Avatar, Box, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Confirm from 'components/Elements/Confirm';
import { Button } from 'components/Elements/index';
import type { ReferenceType } from 'types/html.type';
import request from 'services/request';
import config from 'config';
import SearchInput from '../../Initiative/Input';

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
type PropsType = {
    onClose: any,
    onSelect: any
};
export default forwardRef(({ onClose, onSelect }: PropsType, ref: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [loading] = React.useState(false);
  const confirmRef: ReferenceType = useRef(null);
  const [maxWidth] = React.useState('md');
  const [selectedMember, setSelectedMember] = React.useState({});

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose(true);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const add = () => {
    if (onSelect && selectedMember.uuid) {
      onSelect(selectedMember);
    }
    setOpen(false);
  };

  const [results, setResults] = React.useState({
    list: [],
    total: 0,
    limit: 0,
    offset: 0,
    page: 0,
    pages: 0,

  });
  const [searchParams] = React.useState({
    q: '',
    filters: {},
    limit: 5,
    page: 1,

  });

  const search = useCallback(() => {
    request.get(`${config.services.user}/users`, { searchParams })
      .then((response: ResponseType) => {
        setResults(response.body);
      });
  }, [searchParams]);

  useImperativeHandle(ref, () => ({
    open: handleClickOpen,
  }));

  useEffect(() => {
    search();
  }, [search]);

  return (
    <div>
      <Confirm ref={confirmRef} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth={maxWidth}
      >
        <DialogTitle>Members</DialogTitle>
        <DialogContent className={classes.content}>
          <SearchInput
            onChange={() => {
            }}
          />
          <Box mb={1} />
          {results.list.map((member: any) => (
            <Box
              key={member.uuid}
              className={`${classes.box} ${selectedMember.uuid === member.uuid ? classes.selected : ''}`}
              onClick={() => {
                setSelectedMember(member);
              }}
            >
              <Box display="flex" flexDirection="row" p={1}>
                <Box>
                  <Avatar variant="square" className={classes.avatar} src={`${config.services.file}/content/${member.uuid}?direct=true`} />
                </Box>
                <Box ml={1}>
                  <Typography variant="subtitle1" display="block" gutterBottom>
                    {member.first_name}
                    {' '}
                    {member.last_name}
                  </Typography>
                  <Typography variant="body2" display="block" gutterBottom className={classes.sub}>
                    {member.email}
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
            disabled={!selectedMember.uuid}
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
});
