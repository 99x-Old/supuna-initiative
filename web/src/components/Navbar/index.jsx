import React, { useEffect, useRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import { Avatar, Badge, Hidden } from '@material-ui/core';
import config from 'config';
import type { AuthType } from 'types/auth.type';
import type { StoreType } from 'types/store.type';
import type { InputType, ReferenceType } from 'types/html.type';
import NotificationsIcon from '@material-ui/icons/Notifications';
import BallotIcon from '@material-ui/icons/Ballot';
import TuneSharpIcon from '@material-ui/icons/TuneSharp';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import ProfileMenuComponent from './ProfileMenuComponent';
import NotificationMenu from './NotificationMenu';
import Guard from '../Sytem/Guard';
import store from '../../stores';
import { setNotificationStatus, setSettings } from '../../actions';

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    height: 35,
    verticalAlign: 'sub',
    marginRight: 10,
    left: 0,
  },
  title: {
    fontSize: 35,
    color: theme.palette.secondary.contrastText,
    fontWeight: 500,
    marginLeft: 25,
  },
  brand: {
    fontSize: 35,
    color: theme.palette.secondary.contrastText,
    fontWeight: 500,
    marginLeft: 10,
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: 20,
    paddingTop: 10,
    color: theme.palette.secondary.contrastText,
    border: 'none',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    zIndex: '1301',
  },
  paper: {
    marginRight: 100,
  },
  name: {
    lineHeight: 1,
    marginRight: '1rem',
  },
  subName: {
    color: '#707070',
  },
  icon: {
    padding: '5px',
  },
}));

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const auth: AuthType = useSelector((state: StoreType) => state.auth);
  const notificationStatus = useSelector((state: StoreType) => state.notificationStatus);

  const [darkMode, setDarkMode] = React.useState(0);

  const profileMenuRef: any = useRef(null);
  const notificationMenuRef: any = useRef(null);

  const handleProfileMenu = (event: ReferenceType) => {
    profileMenuRef.current.handleMenu(event);
  };

  const handleNotificationMenu = (event: ReferenceType) => {
    notificationMenuRef.current.handleMenu(event);
    store.dispatch(setNotificationStatus({}));
  };

  const handleDarkMode = (value: number) => {
    store.dispatch(setSettings({ darkMode: value }));
    localStorage.setItem('darkMode', value);
    setDarkMode(value);
  };

  useEffect(() => {
    handleDarkMode(+localStorage.getItem('darkMode'));
  }, []);

  if (!auth) {
    return null;
  }

  const role = auth
    .user?.role?.[0]?.role?.split('-')
    .map((current: string) => current[0].toUpperCase() + current.substr(1))
    .join(' ');

  return (
    <>
      <ProfileMenuComponent ref={profileMenuRef} />
      <NotificationMenu ref={notificationMenuRef} />
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar>
          <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
            <Link
              className={classes.brand}
              href="/"
              component="a"
              onClick={(e: InputType) => {
                history.push('/');
                e.preventDefault();
              }}
              underline="none"
              color="inherit"
              variant="body2"
            >
              <img src="/logo.svg" alt="logo" className={classes.logo} />
              <Hidden only={['xs']}><span>Initiative</span></Hidden>
            </Link>
          </Typography>
          <>
            <div>
              <Guard requiredRole={['initiative-evaluator']}>
                <IconButton
                  className={classes.icon}
                  color="inherit"
                  onClick={(e: InputType) => {
                    history.push('/manage');
                    e.preventDefault();
                  }}
                >
                  <Badge color="primary">
                    <TuneSharpIcon />
                  </Badge>
                </IconButton>
              </Guard>
              <IconButton
                className={classes.icon}
                color="inherit"
                onClick={(e: InputType) => {
                  history.push('/initiative');
                  e.preventDefault();
                }}
              >
                <Badge color="primary">
                  <BallotIcon />
                </Badge>
              </IconButton>
              <Box component="div" display="inline" ml={3}>
                {darkMode
                  ? (
                    <IconButton
                      onClick={() => handleDarkMode(0)}
                      className={classes.icon}
                      color="inherit"
                    >
                      <NightsStayIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleDarkMode(1)}
                      className={classes.icon}
                      color="inherit"
                    >
                      <WbSunnyIcon />
                    </IconButton>
                  )}
              </Box>
              <IconButton
                className={classes.icon}
                color="inherit"
                onClick={(e: InputType) => {
                  handleNotificationMenu(e);
                  e.preventDefault();
                }}
              >
                <Badge badgeContent={notificationStatus.unread} max={9} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </div>
            <Link
              className={classes.title}
              href="/profile"
              component="a"
              onClick={(e: InputType) => {
                history.push('/profile');
                e.preventDefault();
              }}
              underline="none"
              color="inherit"
              variant="body2"
            >
              <Typography
                className={classes.name}
                variant="subtitle1"
                noWrap
              >
                <div>
                  {auth.user.first_name}
                  {' '}
                  {auth.user.last_name}
                </div>
                <small className={classes.subName}>{role}</small>
              </Typography>
            </Link>

            <Box
              borderRadius="50%"
              {...{
                borderColor: 'text.primary',
                m: 1,
                border: 1,
                style: {
                  width: '40px', height: '40px', overflow: 'hidden', cursor: 'pointer',
                },
              }}
              onClick={handleProfileMenu}
            >
              <Avatar
                className={classes.large}
                alt={`${auth.user.first_name} ${auth.user.last_name}`}
                src={`${config.services.file}/content/${auth.user.uuid}?direct=true`}
              />
            </Box>
          </>
        </Toolbar>
      </AppBar>
    </>
  );
};
