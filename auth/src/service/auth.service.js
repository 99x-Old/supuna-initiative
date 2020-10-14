import request from 'service/request';
import qs from 'qs';
import type { ResponseType } from '../type/response.type';
import type { UserMiniType } from '../type/user.type';

export default class AuthService {
  async auth(username: string, password: string, param: {} = {}) {
    return this.verifyLogin(username, password)
      .then(async (val) => {
        const user = val.data.data;
        return this.getToken(user).then((response: {}) => {
          const data = response;
          data.user = user;
          data.message = 'Token has been created!';
          return data;
        });
      });
  }

  verifyLogin(username: string, password: string) {
    return request.post(`${global.config.user_service}/users/verify`, {
      username,
      password,
    });
  }

  getToken(user) {
    const headers = { 'X-Forwarded-Proto': 'https', Host: global.config.auth_server_host };
    request.setHeaders(headers);
    return request.post(`${global.config.token_service}/gateway/oauth2/token`, {
      client_id: global.config.client_id,
      client_secret: global.config.client_secret,
      grant_type: 'password',
      provision_key: global.config.provision_key,
      authenticated_userid: user,
    }).then((response) => response.body);
  }

  getTokenByCode(code: string) {
    const headers = {
      'X-Forwarded-Proto': 'https',
      Host: global.config.auth_server_host,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const payload = qs.stringify({
      client_id: global.config.client_id,
      client_secret: global.config.client_secret,
      grant_type: 'authorization_code',
      code,
    });
    request.setHeaders(headers);
    return request.post(`${global.config.token_service}/gateway/oauth2/token`, payload, headers)
      .then((response) => response.body);
  }

  addUser(user: {}): Promise<ResponseType> {
    const headers = {
      'X-Forwarded-Proto': 'https',
      Host: global.config.auth_server_host,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const payload = qs.stringify(user);
    request.setHeaders(headers);
    request.setContentType('application/json');
    return request.post(`${global.config.user_service}/users`, payload)
      .then((response: ResponseType) => response.body.data);
  }

  getUserByEmail(email: string): Promise<ResponseType> {
    request.setContentType('application/json');
    return request.get(`${global.config.user_service}/users/get/email/${email}`)
      .then((response: ResponseType) => response.body.data);
  }

  getAuthorizationCode(user: UserMiniType) {
    const headers = {
      'X-Forwarded-Proto': 'https',
      Host: global.config.auth_server_host,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const payload = qs.stringify({
      client_id: global.config.client_id,
      response_type: 'code',
      provision_key: global.config.provision_key,
      authenticated_userid: JSON.stringify(user),
    });

    request.setHeaders(headers);
    return request.post(`${global.config.token_service}/gateway/oauth2/authorize`, payload)
      .then((response: ResponseType) => response.body);
  }
}
