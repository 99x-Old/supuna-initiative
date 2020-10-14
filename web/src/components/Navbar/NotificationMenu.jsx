import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import Popover from '@material-ui/core/Menu';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import type { InputType } from '../../types/html.type';
import type { PropsType } from '../../types/react.type';
import List from '../Notification/List';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginRight: theme.spacing(2),
    top: '10',
  },
  popover: {
    width: '400px',
  },
}));

export default forwardRef((props: PropsType, ref: any) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

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
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        getContentAnchorEl={null}
      >
        <Box className={classes.popover}>

          <Scrollbars
            style={{ height: '500px' }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={1000}
          >
            <List />
          </Scrollbars>
        </Box>
      </Popover>
    </Paper>
  );
});
