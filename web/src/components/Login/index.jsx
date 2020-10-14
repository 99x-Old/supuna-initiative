import React, { useEffect, useState } from 'react';
import { Box, Divider, TextField } from '@material-ui/core';
import Button from 'components/Elements/Button';
import Link from '@material-ui/core/Link';
import InputLabel from '@material-ui/core/InputLabel';
import { useHistory } from 'react-router-dom';
import Authentication from 'auth';
import Alert from '@material-ui/lab/Alert';
import config from 'config';
import type { ErrorResponseType } from 'types/response.type';
import type { InputType } from 'types/html.type';
import store from '../../stores';
import { setSettings } from '../../actions';

type PropsType = {
    onClickSignUp: ()=>{},
    location: any
};

export default ({ onClickSignUp, location }: PropsType) => {
  const history = useHistory();
  const [responseMessage, setResponseMessage] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = React.useState(false);

  const [oAuthError, setOAuthError] = React.useState(false);

  const login = (event: InputType) => {
    event.preventDefault();
    setResponseMessage(null);
    setLoading(true);

    Authentication.login(username,
      password).then(() => {
      history.push('/profile');
    }).catch((error: ErrorResponseType) => {
      setResponseMessage(error.message);
      setLoading(false);
    });
  };

  const microsoftLogin = () => {
    setLoading(true);
    window.location.replace(`${config.services.auth}/api/microsoft/login`);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', 0);
    store.dispatch(setSettings({ darkMode: 0 }));

    const code = new URLSearchParams(location.search).get('code');
    setOAuthError({
      error: new URLSearchParams(location.search).get('error'),
      description: new URLSearchParams(location.search).get('error_description'),
    });

    if (code) {
      setLoading(true);
      Authentication.loginByCode(code).then(() => {
        history.push('/');
      }).catch((error: ErrorResponseType) => {
        setResponseMessage(error.message);
        setLoading(false);
      });
    }
  }, [history, location.search]);

  return (
    <form action="#" onSubmit={login}>
      <Box mb={1}>
        <Box mb={1}>
          <InputLabel>Email address</InputLabel>
        </Box>
        <TextField
          fullWidth
          id="login-email"
          name="username"
          placeholder="Email"
          onChange={(e: InputType) => {
            setUsername(e.target.value);
          }}
        />
      </Box>
      <Box mb={1}>
        <Box mb={1}>
          <InputLabel>Password</InputLabel>
        </Box>
        <TextField
          fullWidth
          type="password"
          id="login-password"
          name="password"
          placeholder="Password"
          onChange={(e: InputType) => {
            setPassword(e.target.value);
          }}
        />
      </Box>
      <Link style={{ fontSize: 14 }} to="#forgot-password">
        Forgot your password?
      </Link>
      <Box mt={1}>
        {responseMessage && <Alert severity="error">{responseMessage}</Alert>}
      </Box>
      <Box mt={1} display="flex" flexDirection="row">
        <Button
          style={{ backgroundColor: '#00A4EF' }}
          variant="contained"
          color="primary"
          disableElevation
          loading={loading}
          onClick={microsoftLogin}
        >
          <img height={25} src="/ms-logo.svg" alt="logo" />
          <Box mr={1} />
          Login With Microsoft
        </Button>
        <Box mr={1} />
        <Button
          disabled
          variant="contained"
          color="primary"
          disableElevation
          type="submit"
        >
          Login
        </Button>

      </Box>

      {onClickSignUp
        ? (
          <Box mt={1} style={{ fontSize: 14 }}>
            Not registered ?&nbsp;
            <Link
              disabled
              style={{ fontFamily: 'inherit' }}
              type="button"
              to="#sighup"
              component="button"
              onClick={(e: InputType) => {
                onClickSignUp(true);
                e.stopPropagation();
              }}
            >
              Sign up
            </Link>
          </Box>
        )
        : null}

      {oAuthError && oAuthError.error && (
      <Box>
        <Box mt={1} mb={1}>
          <Divider />
        </Box>
        <strong>Something went wrong:</strong>
        <Box mt={1} mb={1}>{oAuthError.error}</Box>
        <Box mt={1} mb={1}>{oAuthError.description}</Box>
        <Button
          onClick={() => {
            history.push('/');
            setOAuthError(false);
          }}
          color="primary"
        >
          Close
        </Button>
      </Box>
      )}

    </form>
  );
};
