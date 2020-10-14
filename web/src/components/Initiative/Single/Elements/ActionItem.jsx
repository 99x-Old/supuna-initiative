import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';
import ProgressLiner from 'components/Elements/ProgressLiner';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import type { ActionType } from 'types/action.type';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Viewer from 'components/Elements/Viewer';
import request from 'services/request';
import config from 'config';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 190,
    cursor: 'pointer',
  },
  title: {
    fontSize: 14,
    width: '100%',
  },
  manageIcon: {
    padding: 4,
    display: 'inline-block',
  },
  body: {
    height: '60px',
    overflow: 'hidden',
  },
  name: {
    display: 'inline-block',
    '& p': {
      margin: '0',
      marginBottom: '0.5rem',
    },
  },
  description: {
    height: '20px',
  },
  done: {
    verticalAlign: 'middle',
    fontSize: '1rem',
    color: 'green',
  },
  avatar: {
    '& div': {
      width: theme.spacing(3),
      height: theme.spacing(3),
      border: 'none',
      color: theme.palette.secondary.dark,
      fontSize: 14,
    },
  },
}));

type PropsType = {
  action: ActionType,
  handleMange: any
};

export default ({ action, handleMange }: PropsType) => {
  const classes = useStyles();
  const [progress, setProgress] = useState(0);
  const [users, setUsers] = useState([]);

  const processMembers = useCallback((ids: string[]) => {
    request
      .get(`${config.services.user}/users/get/list/${ids.join(',')}`)
      .then((memberResponse: ResponseType) => {
        setUsers(memberResponse.body);
      });
  }, []);

  const handleClickOpen = () => {
    if (handleMange) {
      handleMange(action);
    }
  };

  useEffect(() => {
    const percentage = (action.subActions
      .reduce((oldValue: any, subAction: any) => oldValue
          + (subAction.done ? 1 : 0), 0) / action.subActions.length) * 100;
    setProgress((!action.subActions.length && action.done) ? 100 : (percentage || 0));
  }, [action]);

  useEffect(() => {
    if (action.users?.length) {
      processMembers(action.users);
    }
  }, [action, processMembers]);
  return (
    <Box>
      <Card className={classes.root} onClick={handleClickOpen}>
        <CardContent>
          <Typography variant="h6" component="div">
            <Viewer escapeHtml={false} source={action.name} className={classes.name} />
          </Typography>
          <Typography variant="body2" component="div" className={classes.body} title={action.description}>
            <Viewer
              escapeHtml={false}
              source={action.description}
              max={100}
            />
          </Typography>
          <ProgressLiner progress={progress} />
        </CardContent>
        <CardActions>
          <Typography className={classes.title} color="textSecondary" component="div">
            <Box display="flex">
              <Box flexGrow={1}>
                <AvatarGroup max={3} className={classes.avatar}>
                  {users && users.map((user: any, index: number) => (
                    <Avatar
                      key={index}
                      alt={user.first_name}
                      src={`${config.services.file}/content/${user.uuid}?direct=true`}
                    />
                  ))}
                </AvatarGroup>
              </Box>
              <Box>
                {!!action.done && <CheckCircleIcon className={classes.done} titleAccess="This action is done!" />}
                {!!action.deadline && moment.utc(action.deadline).format('LLL')}
              </Box>
            </Box>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};
