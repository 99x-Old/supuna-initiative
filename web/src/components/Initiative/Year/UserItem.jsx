import React from 'react';
import {
  Avatar, Box, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import type { ProfileType } from 'types/profile.type';
import config from '../../../config';

const useStyles = (props: any) => makeStyles((theme: Theme) => ({
  avatar: {
    marginLeft: '0.2rem',
    width: theme.spacing(+props.size ?? 7),
    height: theme.spacing(+props.size ?? 7),
  },
  box: {
    display: 'inline-block',
    cursor: 'pointer',
  },
  sub: {
    whiteSpace: 'nowrap',
    width: '10rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

type PropsType = {
  user: ProfileType,
  memberType: string,
  size: string,
  onclick: string
};
export default ({
  user, memberType, size, onclick,
}: PropsType) => {
  const classes = useStyles({ size })();

  if (!user) return null;

  return (
    <Box className={classes.box} onClick={onclick}>
      <Typography component="div">
        <Box display="flex" flexDirection="row">
          <Box>
            <Avatar alt={user.first_name} variant="square" className={classes.avatar} src={`${config.services.file}/content/${user.uuid}?direct=true`} />
          </Box>
          <Box ml={1}>
            <Typography variant="caption" display="block" gutterBottom component="div">
              {user.first_name}
              {' '}
              {user.last_name}
            </Typography>
            <Typography variant="body2" display="block" className={classes.sub} component="div" title={memberType}>
              {memberType}
            </Typography>
          </Box>
        </Box>
      </Typography>
    </Box>
  );
};
