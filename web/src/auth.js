import localStore from 'store2';
import request from 'services/request';
import config from 'config';
import { setAuth, setSettings } from 'actions';
import type { AuthType } from 'types/auth.type';
import store from 'stores';
import { disconnect } from 'listeners/message-status.listener';
import Notification from 'services/notification';

const querystring = require('querystring');

class Auth {
    isAuthenticated: any = null;

    constructor() {
      store.dispatch(setAuth(localStore('auth')));
      const { auth } = store.getState();
      this.auth = auth;
      this.authCheck();
    }

    authCheck() {
      request.get(`${config.services.auth}/check`).then((response: ResponseType) => {
        if (response.body === false) {
          this.isAuthenticated = false;
          store.dispatch(setAuth(null));
        } else {
          this.isAuthenticated = true;
          this.runWhileLogged();
        }
      }).catch(() => {
        this.isAuthenticated = false;
        store.dispatch(setAuth(null));
      });
    }

    getAuthValues(accessToken: string): Promise<ResponseType> {
      request.setHeaders({
        Authorization: `Bearer ${accessToken}`,
      });
      return request.post(`${config.services.auth}/api/auth/get`);
    }

    login(username: string, password: string): ResponseType {
      return request.post(`${config.services.auth}/api/auth`, querystring.stringify({
        username,
        password,
      }))
        .then((response: ResponseType) => {
          this.isAuthenticated = true;
          store.dispatch(setAuth(response.body));
          this.runWhileLogged();
          return response;
        });
    }

    loginByCode(authorizationCode: string): ResponseType {
      return request.get(`${config.services.auth}/api/auth`, { params: { authorizationCode } })
        .then(async (response: ResponseType) => {
          const auth = await this.getAuthValues(response.body.access_token);
          const data = response.body;
          data.user = auth.body;
          store.dispatch(setAuth(data));
          this.isAuthenticated = true;
          this.runWhileLogged();
          return response;
        });
    }

    signOut() {
      store.dispatch(setAuth(null));
      this.runWhenLogout();
    }

    getAuth(): AuthType {
      return this.auth;
    }

    runWhileLogged() {
      const notification = new Notification();
      notification.refreshNotificationsStatus();
      notification.listen(this.auth.user.uuid);
    }

    runWhenLogout() {
      store.dispatch(setSettings({ darkMode: 0 }));
      disconnect();
    }
}

export default new Auth();
