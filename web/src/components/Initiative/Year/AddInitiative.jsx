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
import { Button } from 'components/Elements';
import type { ReferenceType } from 'types/html.type';
import request from 'services/request';
import config from 'config';
import Viewer from '../../Elements/Viewer';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    overflow: 'hidden',
    minWidth: '500px',
  },
  avatar: {
    marginLeft: '0.2rem',
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  box: {
    width: '50%',
    display: 'inline-block',
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: '#ccc',
  },
}));
type PropsType = {
    roles: [],
    onClose: any,
    onSelect: any
};
export default forwardRef(({ roles, onClose, onSelect }: PropsType, ref: any) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [, setAvailableRoles] = React.useState([]);
  const [loading] = React.useState(false);
  const confirmRef: ReferenceType = useRef(null);
  const [maxWidth] = React.useState('md');
  const [initiativeList, setInitiativeList] = React.useState([]);
  const [selectedInitiative, setSelectedInitiative] = React.useState({});

  const listInitiative = useCallback(() => {
    request.setContentType('application/json');
    request.get(`${config.services.initiative}/initiatives`)
      .then((response: ResponseType) => {
        setInitiativeList(response.body);
      });
  }, []);

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
    if (onSelect && selectedInitiative.uuid) {
      onSelect(selectedInitiative);
    }
    setOpen(false);
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

  useEffect(() => {
    listInitiative();
  }, [listInitiative]);

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
        <DialogTitle>
          Initiatives
        </DialogTitle>
        <DialogContent className={classes.content}>
          {initiativeList.map((initiative: any) => (
            <Box
              key={initiative.uuid}
              className={`${classes.box} ${selectedInitiative.uuid === initiative.uuid ? classes.selected : ''}`}
              onClick={() => {
                setSelectedInitiative(initiative);
              }}
            >
              <Box display="flex" flexDirection="row" p={1}>
                <Box>
                  <Avatar variant="square" className={classes.avatar} src={`${config.services.file}/content/${initiative.uuid}?direct=true`} />
                </Box>
                <Box ml={1}>
                  <Typography variant="subtitle1" display="block" gutterBottom>
                    {initiative.name}
                  </Typography>
                  <Viewer escapeHtml={false} source={initiative.description} max={100} />
                </Box>
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">
            Close
          </Button>
          <Button color="primary" loading={loading} onClick={add} disabled={!selectedInitiative.uuid}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
});
