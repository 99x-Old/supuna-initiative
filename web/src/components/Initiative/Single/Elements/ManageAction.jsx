import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import {
  Box, Grid, InputLabel, Theme,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import React, {
  forwardRef, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Editor from 'components/Editor';
import ReactMarkdown from 'react-markdown';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import request from 'services/request';
import config from 'config';
import { Button } from 'components/Elements';
import Feed from 'components/Feed';
import { Scrollbars } from 'react-custom-scrollbars';
import Members from 'components/Elements/Members';
import UserItem from '../../Year/UserItem';
import Guard from '../../../Sytem/Guard';
import type { ReferenceType } from '../../../../types/html.type';
import Confirm from '../../../Elements/Confirm';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    minWidth: '500px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  manageIcon: {
    padding: 4,
  },
  subActions: {
    padding: '0',
    paddingLeft: '10px',
  },
  subItem: {
    '& p': {
      margin: '0',
    },
  },
  label: {
    color: theme.palette.secondary.contrastText,
    marginBottom: '5px',
    fontSize: '0.9rem',
  },
}));

export default forwardRef(({ initiativeId, onSaved }: PropsType, ref: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const actionNameRef: ReferenceType = useRef(null);
  const actionDescriptionRef: ReferenceType = useRef(null);
  const addiMemberRef: ReferenceType = useRef(null);
  const actionSubNameRef: ReferenceType = useRef(null);
  const confirmRef: ReferenceType = useRef(null);

  const [action, setAction] = React.useState({});
  const [users, setUsers] = React.useState([]);
  const [subActions, setSubActions] = React.useState([]);
  const [deadline, setDeadline] = React.useState(Date.now());
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const save = useCallback(() => {
    setLoading(true);
    const name = actionNameRef.current.getContents();
    const description = actionDescriptionRef.current.getContents();
    const userIds = users.map((user: any) => user.uuid);

    request.setContentType('application/json');
    request.post(`${config.services.initiative}/initiatives/set/action`, {
      name, description, userIds, initiativeId, subActions, deadline,
    })
      .then(() => {
        handleClose();
        if (onSaved) {
          onSaved();
        }
      }).catch(() => {

      }).finally(() => {
        setLoading(false);
      });
  }, [deadline, initiativeId, onSaved, subActions, users]);

  const remove = useCallback(() => {
    setLoading(true);
    request.setContentType('application/json');
    return request.delete(`${config.services.initiative}/initiatives/delete/action/${action.uuid}`)
      .then(() => {
        handleClose();
        if (onSaved) {
          onSaved();
        }
      }).catch(() => {

      }).finally(() => {
        setLoading(false);
      });
  }, [action.uuid, onSaved]);

  const update = useCallback((done: boolean = false) => {
    setLoading(true);
    const name = actionNameRef.current.getContents();
    const description = actionDescriptionRef.current.getContents();
    const userIds = users.map((user: any) => user.uuid);

    request.setContentType('application/json');
    request.put(`${config.services.initiative}/initiatives/set/action/${action.uuid}`, {
      name, description, userIds, initiativeId, subActions, deadline, done,
    })
      .then(() => {
        handleClose();
        if (onSaved) {
          onSaved();
        }
      }).catch(() => {

      }).finally(() => {
        setLoading(false);
      });
  }, [action.uuid, deadline, initiativeId, onSaved, subActions, users]);

  const removeAction = () => {
    const option: any = {
      title: 'Are you sure you want to remove this action ?',
      confirmText: 'Remove',
    };
    confirmRef.current.open(true, option, () => () => remove());
  };

  const processMembers = useCallback((ids: string[]) => {
    request
      .get(`${config.services.user}/users/get/list/${ids.join(',')}`)
      .then((memberResponse: ResponseType) => {
        setUsers(memberResponse.body);
      });
  }, []);

  const handleDeadlineChange = (date: Date) => {
    setDeadline(date);
  };

  const handleAddMember = () => {
    addiMemberRef.current.open();
  };

  const handleSubAction = (actionItem: any, index: number) => {
    setSubActions((currentSubActions: any[]) => {
      const changedSubAction = currentSubActions;
      changedSubAction[index].done = !actionItem.done;
      return [...changedSubAction];
    });
  };

  const handleClickOpen = (actionData: any = null) => {
    setOpen(true);
    if (actionData) {
      setAction(actionData);
      setDeadline(actionData.deadline);
      setSubActions(actionData.subActions ?? []);

      setUsers([]);
      if (actionData.users?.length) {
        processMembers(actionData.users);
      }
    }
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
      <Confirm ref={confirmRef} />
      <Members
        ref={addiMemberRef}
        onSelect={(member: any) => {
          setUsers((currentUsers: []) => [...currentUsers, member]);
        }}
      />
      <DialogTitle>Action</DialogTitle>
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
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <InputLabel className={classes.label}>Action</InputLabel>
                <Editor contents={action.name} placeholder="Name..." ref={actionNameRef} />
                <Box mt={1} />
                <InputLabel className={classes.label}>Description</InputLabel>
                <Editor contents={action.description} placeholder="Description..." height="100px" ref={actionDescriptionRef} />
                <Box mt={1} />
                <InputLabel className={classes.label}>Deadline</InputLabel>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="none"
                    format="yyyy/MM/dd"
                    value={deadline}
                    onChange={handleDeadlineChange}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
                <InputLabel className={classes.label}>
                  Participant
                  <IconButton className={classes.iconButton} onClick={handleAddMember}>
                    <AddCircleIcon className={classes.icon} />
                  </IconButton>
                </InputLabel>
                <Grid item md={12}>
                  {users.map((user: any) => (
                    <UserItem key={user.uuid} user={user} memberType="" size="4" />
                  ))}
                </Grid>
                <Box mt={1} />
                {action.uuid && (
                <>
                  <InputLabel className={classes.label}>Comments</InputLabel>
                  <Feed reference={action.uuid} />
                </>
                )}
              </Grid>
              <Grid item xs={5}>
                <InputLabel className={classes.label}>Sub actions</InputLabel>
                {subActions.map((subAction: any, index: number) => (
                  <Box key={index} mb={1}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={subAction.done}
                          className={classes.subActions}
                          onClick={() => handleSubAction(subAction, index)}
                          color="primary"
                        />
                        )}
                      label={(
                        <ReactMarkdown
                          className={classes.subItem}
                          escapeHtml={false}
                          source={subAction.value}
                        />
)}
                    />
                  </Box>
                ))}
                <Editor
                  placeholder="Type..."
                  pressEnterSave
                  ref={actionSubNameRef}
                  toolbarHidden
                  save={(value: string) => {
                    setSubActions((currentSubActions: []) => (
                      [...currentSubActions, { value, done: false }]
                    ));
                    actionSubNameRef.current.setContents('');
                  }}
                />

              </Grid>
            </Grid>
          </Box>
        </Scrollbars>
      </DialogContent>
      <DialogActions>
        <Guard requiredPermission="add-initiative-action">
          {action?.uuid && <Button onClick={removeAction}>Remove</Button>}
          {action?.done === false && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              update(true);
            }}
          >
            Mark As Done
          </Button>
)}
          {action?.uuid ? <Button variant="contained" loading={loading} color="primary" onClick={() => update()}>Update</Button>
            : <Button variant="contained" color="primary" loading={loading} onClick={save}>Add</Button>}
        </Guard>
      </DialogActions>
    </Dialog>
  );
});
