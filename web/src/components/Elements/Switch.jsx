import React, { forwardRef } from 'react';
import { Switch, Theme, withStyles } from '@material-ui/core';
import type { PropsType } from '../../types/react.type';

const AntSwitch = withStyles((theme: Theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 'none',
      },
    },
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.contrastText,
    margin: 2,
  },
  track: {
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.background.paper,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({
  classes,
  ...props
}: any) => (
  <Switch
    focusVisibleClassName={classes.focusVisible}
    disableRipple
    classes={{
      root: classes.root,
      switchBase: classes.switchBase,
      thumb: classes.thumb,
      track: classes.track,
      checked: classes.checked,
    }}
    {...props}
  />
));
export default forwardRef((props: PropsType) => (
  <AntSwitch {...props} />
));
