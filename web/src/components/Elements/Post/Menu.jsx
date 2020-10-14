import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import Popover from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BlockIcon from '@material-ui/icons/Block';
import ReportIcon from '@material-ui/icons/Report';
import { Divider } from '@material-ui/core';
import type { PropsType } from '../../../types/react.type';
import type { InputType } from '../../../types/html.type';

export default forwardRef(({ menuItem }: PropsType, ref: any) => {
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
    handleMenu, handleClose,
  }));

  return (
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
      <MenuItem onClick={menuItem.removePost}>
        <BlockIcon />
        Remove
      </MenuItem>
      <Divider />
      <MenuItem>
        <ReportIcon />
        Report
      </MenuItem>
    </Popover>
  );
});
