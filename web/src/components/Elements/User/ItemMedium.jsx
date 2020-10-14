import React from 'react';
import {
  Avatar, Box, Link, makeStyles, Theme, Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import config from 'config';
import type { ProfileType } from 'types/profile.type';

const useStyles = makeStyles((theme: Theme) => ({
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
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

  return (
    <Grid container alignItems="center">
      <Box>
        <Link href={`profile/${user.uuid}`} onClick={goToProfile} underline="none">
          <Avatar
            className={classes.large}
            alt="Remy Sharp"
            src={`${config.services.content}/file?category=profile-picture:medium&user_id=${user.uuid}`}
          />
        </Link>
      </Box>
      <Box pl={1}>
        <Typography component="div" variant="body2" color="initial">
          <div>{`${user.first_name} ${user.last_name}`}</div>
        </Typography>
        <Typography variant="body2" display="block" gutterBottom component="div">
          {user.sub}
        </Typography>
      </Box>
    </Grid>
  );
};
