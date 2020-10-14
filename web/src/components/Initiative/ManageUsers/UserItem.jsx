import React, { useEffect } from 'react';
import {
  Avatar, Box, Theme, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import type { ProfileType } from 'types/profile.type';
import config from '../../../config';
import request from '../../../services/request';
import type { ResponseType } from '../../../types/response.type';
import SkeletonUsers from '../Skeleton/SkeletonUsers';

const useStyles = makeStyles((theme: Theme) => ({
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

}));
type PropsType = {
  onClick: any,
  user: ProfileType,
  subItem: ProfileType,
  userId: ProfileType
};
export default ({
  onClick, user, subItem, userId,
}: PropsType) => {
  const classes = useStyles();
  const [userDetails, setUserDetails] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      request
        .get(`${config.services.user}/users/${userId}`)
        .then((response: ResponseType) => {
          setUserDetails(response.body);
        }).finally(() => {
          setLoading(false);
        });
    } else {
      setUserDetails(user);
    }
  }, [user, userId]);

  if (loading) {
    return (
      <Box className={classes.box}>
        <SkeletonUsers />
      </Box>
    );
  }

  return (
    <>
      {!!userDetails.first_name && (
        <Box
          className={classes.box}
          onClick={() => {
            if (onClick) {
              onClick(user);
            }
          }}
        >
          <Box display="flex" flexDirection="row" p={1} m={1}>
            <Box>
              <Avatar
                alt={userDetails.first_name}
                variant="square"
                className={classes.avatar}
                src={`${config.services.file}/content/${userDetails.uuid}?direct=true`}
              />
            </Box>
            <Box ml={1}>
              <Typography variant="subtitle1" display="block" gutterBottom>
                {userDetails.first_name}
                {' '}
                {userDetails.last_name}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom component="div">
                {subItem}
              </Typography>

            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
