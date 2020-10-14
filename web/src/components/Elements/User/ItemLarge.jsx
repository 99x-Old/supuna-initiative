import React from 'react';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { useHistory } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Chip from '@material-ui/core/Chip';
import moment from 'moment';
import config from 'config';
import type { ProfileType } from 'types/profile.type';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  content: {
    marginLeft: 6,
  },
  bio: {
    '& p': {
      margin: 0,
    },
  },
}));

type PropsType = {
  user: ProfileType
};

export default ({ user }: PropsType) => {
  const classes = useStyles();
  const history = useHistory();

  const goToProfile = (e: Event) => {
    history.push(`/profile/${user.uuid}`);
    e.preventDefault();
  };

  const cropWords = (text: string, maxLength: number = 200) => {
    const trimmedString = text.substr(0, maxLength);
    return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
  };

  return (
    <>
      {user && (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link href={`profile/${user.uuid}`} onClick={goToProfile} underline="none">
            <Avatar
              variant="square"
              alt="Travis Howard"
              src={`${config.services.content}/file?category=profile-picture:medium&user_id=${user.uuid}`}
              className={classes.large}
            >
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </Avatar>
          </Link>
        </ListItemAvatar>
        <ListItemText
          className={classes.content}
          primary={(
            <Typography
              component="div"
              variant="subtitle1"
              color="error"
            >
              {' '}
              <Link
                href={`profile/${user.uuid}`}
                underline="none"
                onClick={goToProfile}
              >
                {' '}
                {user.first_name}
                {' '}
                {user.last_name}
              </Link>
            </Typography>
          )}
          color="primary"
          disableTypography
          secondary={(
            <>
              <Grid container>
                <Grid item md={10}>
                  <Chip label={user.gender.gender} />
                  {' '}
                  <Chip label={moment.utc().diff(user.birth, 'years')} />
                  <ReactMarkdown
                    renderers={{ Paragraph: 'span' }}
                    className={classes.bio}
                    escapeHtml={false}
                    source={`${cropWords(user.bio)}...`}
                  />
                </Grid>
              </Grid>
            </>
            )}
        />

      </ListItem>
      )}
    </>
  );
};
