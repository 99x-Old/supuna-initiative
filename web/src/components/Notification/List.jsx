import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import { Box, Divider } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import config from '../../config';
import request from '../../services/request';
import type { InputType } from '../../types/html.type';
import SkeletonSmallList from '../Initiative/Skeleton/SkeletonSmallList';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  menuItem: {
    padding: 0,
  },
  text: {
    whiteSpace: 'normal',
  },
}));
export default () => {
  const classes = useStyles();
  const history = useHistory();

  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getNotifications = useCallback(() => {
    request.setContentType('application/json');
    setLoading(true);
    request.get(`${config.services.notification}/list`)
      .then((response: ResponseType) => {
        setNotifications(response.body);
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  const getRawContents = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, '');

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  if (loading) {
    return <SkeletonSmallList />;
  }

  return (
    <div className={classes.root}>
      {notifications.map((notification: any, index: number) => (
        <Box key={index}>
          <MenuItem
            component="div"
            onClick={(e: InputType) => {
              history.push(notification?.options?.path ? `/${notification?.options?.path}` : '/notification');
              e.preventDefault();
            }}
          >
            <ListItem className={classes.menuItem}>
              <ListItemAvatar>
                <Avatar alt={notification.text} className={classes.avatar} src={`${config.services.file}/content/${notification.from}?direct=true`} />
              </ListItemAvatar>
              <ListItemText
                className={classes.text}
                primary={getRawContents(notification.text)}
                secondary={(
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    />
                    —
                    {moment.utc(notification.created_at).fromNow()}
                  </>
 )}
              />
            </ListItem>
          </MenuItem>
          <Divider />
        </Box>

      ))}
    </div>
  );
};
