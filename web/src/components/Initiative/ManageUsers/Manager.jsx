import React, {
  ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import {
  Avatar, Box, Chip, Switch, TextField, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete';
import Confirm from 'components/Elements/Confirm';
import type { ProfileType, SectionTitleType } from 'types/profile.type';
import request from 'services/request';
import config from 'config';
import { Button } from 'components/Elements';
import type { InputType, ReferenceType } from 'types/html.type';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    marginLeft: '0.2rem',
    width: theme.spacing(23),
    height: theme.spacing(30),
  },
  content: {
    overflow: 'hidden',
    minWidth: '500px',
  },
}));
type PropsType = {
  roles: [],
  onClose: any
};
export default forwardRef(({ roles, onClose }: PropsType, ref: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [availableRoles, setAvailableRoles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const confirmRef: ReferenceType = useRef(null);

  const [userDetails, setUserDetails] = useState({
    uuid: '',
    first_name: '',
    last_name: '',
    roles: [],
    status: true,
  });

  const handleClose = (callParen: boolean = true) => {
    setOpen(false);
    if (onClose && callParen) {
      onClose(true);
    }
  };

  const save = () => {
    setLoading(true);
    request.setContentType('application/json');
    request.put(`${config.services.user}/users`, userDetails)
      .then(() => {
        handleClose();
      }).finally(() => {
        setLoading(false);
      });
  };
  const deleteUser = () => {
    setLoading(true);
    request.setContentType('application/json');
    return request.delete(`${config.services.user}/users/${userDetails.uuid}`)
      .then(() => {
        handleClose();
        return true;
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleStatus = () => {
    setUserDetails((currentUserDetails: any) => (
      {
        ...currentUserDetails,
        ...{ status: !currentUserDetails.status },
      }));
  };
  const handleOpen = (action: any) => {
    const option: any = {
      title: `Are you sure you want to delete ${userDetails.first_name} ?`,
      confirmText: 'Delete',
    };
    confirmRef
      .current
      .open(action, option, () => () => deleteUser());
  };

  const handleClickOpen = (user: ProfileType) => {
    setOpen(true);
    const userItem = {
      uuid: user.uuid,
      status: user.status,
      first_name: user.first_name,
      last_name: user.last_name,
      roles: user.role.map((roleItem: any) => ({
        name: roleItem.role,
        value: roleItem._id,
      })),
    };
    setUserDetails(userItem);
  };

  const handleDelete = () => {
    handleOpen(true);
  };

  useEffect(() => {
    if (roles) {
      setAvailableRoles(roles.map((role: any) => ({
        name: role.role,
        value: role._id,
      })));
    }
  }, [roles]);

  useImperativeHandle(ref, () => ({
    open: handleClickOpen,
  }));

  return (
    <div>
      <Confirm ref={confirmRef} />
      <Dialog open={open} onClose={() => handleClose(false)}>
        <DialogTitle id="form-dialog-title">
          Manage
          {' '}
          {userDetails.first_name}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Grid container spacing={3}>
            <Grid item md={5}>
              <Avatar alt={userDetails.first_name} variant="square" src={`${config.services.file}/content/${userDetails.uuid}?direct=true`} className={classes.avatar} />
            </Grid>
            <Grid item md={7}>
              <Typography component="div" color="inherit" variant="body1">
                <Box mb={1}>
                  <TextField
                    placeholder="First Name"
                    value={userDetails.first_name}
                    onChange={(e: InputType) => {
                      setUserDetails((currentUserDetails: any) => (
                        {
                          ...currentUserDetails,
                          ...{ first_name: e.target.value },
                        }));
                      e.persist();
                    }}
                  />
                </Box>
                <Box mb={1}>
                  <TextField
                    placeholder="Last Name"
                    value={userDetails.last_name}
                    onChange={(e: InputType) => {
                      setUserDetails((currentUserDetails: any) => (
                        {
                          ...currentUserDetails,
                          ...{ last_name: e.target.value },
                        }));
                      e.persist();
                    }}
                  />
                </Box>
                <Box mb={1}>
                  <Autocomplete
                    onChange={(e: ChangeEvent, changedTitle: SectionTitleType) => {
                      const changedRoles = changedTitle;
                      setUserDetails((currentUserDetails: any) => (
                        {
                          ...currentUserDetails,
                          ...{ roles: changedRoles },
                        }));
                    }}
                    getOptionSelected={
                      (
                        option: SectionTitleType,
                        value: SectionTitleType,
                      ) => value.name === option.name
                    }
                    value={userDetails.roles}
                    defaultValue={userDetails.roles}
                    options={availableRoles}
                    multiple
                    popupIcon={false}
                    noOptionsText="No Roles"
                    className={classes.title}
                    getOptionLabel={(option: SectionTitleType) => option.name ?? ''}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextField
                        {...params}
                        fullWidth
                        placeholder="Roles"
                      />
                    )}
                  />
                </Box>
                <small>Account Status:</small>
                {' '}
                <Switch
                  checked={!!userDetails.status}
                  onChange={handleStatus}
                  color="primary"
                />
                {' '}
                {userDetails.status ? <Chip label="Active" color="primary" /> : <Chip label="Inactive" />}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">
            Close
          </Button>
          <Button onClick={handleDelete} color="default">
            Delete
          </Button>
          <Button onClick={save} color="primary" loading={loading} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
});
