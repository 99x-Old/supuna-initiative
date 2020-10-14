import store from 'stores';
import { setAuth, setError } from 'actions';
import RequestException from './request.exception';
import type { ErrorResponseType } from '../../types/response.type';

export const redirectTo = (path: string) => {
  window.redirect = () => {
    window.location = path;
    return false;
  };
  window.redirect();
};

export default (error: ErrorResponseType) => {
  const { auth } = store.getState();

  if (error.response) {
    switch (error.response.status) {
      case 422:
        store.dispatch(setError(new RequestException(error.response
          .data.message, error.response.status, error.response.data.data)));
        break;
      case 403:
        break;
      case 401:
        store.dispatch(setError(
          new RequestException('You are not logged in!', error.response.status, {}),
        ));
        if (auth) {
          redirectTo('#auth-fail');
          store.dispatch(setAuth(null));
        }
        break;
      case 404:
        break;
      default:
        break;
    }
    return Promise.reject(
      new RequestException(
        error.response.data.message,
        error.response.status,
        error.response.data.data,
      ),
    );
  }
  return Promise.reject();
};
