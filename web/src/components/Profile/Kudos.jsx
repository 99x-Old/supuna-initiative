import React, { useCallback, useEffect } from 'react';
import {
  Avatar, Box, Theme, Typography,
} from '@material-ui/core';
import config from 'config';
import { makeStyles } from '@material-ui/core/styles';
import request from '../../services/request';
import SkeletonUsers from '../Initiative/Skeleton/SkeletonUsers';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    marginLeft: '0.2rem',
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default ({ userId }: any) => {
  const [kudos, setKudos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();

  const list = useCallback(() => {
    setLoading(true);
    request.get(`${config.services.user}/kudos/${userId}`)
      .then((response: ResponseType) => {
        setKudos(response.body);
      }).finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    list();
  }, [list]);

  if (loading) {
    return (<SkeletonUsers />);
  }

  return (
    <Box
      display="flex"
      flexWrap="wrap"
    >
      {kudos.map((kudosItem: any) => (
        <Box
          key={kudosItem.uuid}
        >
          <Box display="flex" flexDirection="row" p={1}>
            <Box>
              <Avatar variant="square" className={classes.avatar} src={`${config.services.file}/content/${kudosItem.uuid}?direct=true`} />
            </Box>
            <Box ml={1}>
              <Typography variant="subtitle1" display="block" gutterBottom>
                {kudosItem.kudos.kudos}
              </Typography>
              <Typography variant="body2" display="block" gutterBottom>
                From:
                {' '}
                {kudosItem.givenBy?.first_name}
                {' '}
                {kudosItem.givenBy?.last_name}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>

  );
};
