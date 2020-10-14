import React, {
  forwardRef, useEffect, useImperativeHandle, useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import Popover from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Authentication from 'auth';
import type { InputType, ReferenceType } from '../../types/html.type';
import type { PropsType } from '../../types/react.type';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export default forwardRef((props: PropsType, ref: any) => {
  const classes = useStyles();
  const settingsRef: ReferenceType = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();

  const handleMenu = (event: InputType) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {

  });

  useImperativeHandle(ref, () => ({
    handleMenu,
  }));

  return (
    <Paper ref={ref} className={classes.paper}>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
      >
        <MenuItem
          component="div"
          href="/profile"
          onClick={(e: InputType) => {
            history.push('/profile');
            handleClose();
            e.preventDefault();
          }}
        >
          Profile
        </MenuItem>
        <MenuItem onClick={() => {
          settingsRef.current.open();
        }}
        >
          Account Settings
        </MenuItem>
        <MenuItem>Privacy</MenuItem>
        <Divider light />
        <MenuItem onClick={() => {
          Authentication.signOut();
          handleClose();
          history.push('/');
        }}
        >
          Logout
        </MenuItem>
      </Popover>
    </Paper>
  );
});
