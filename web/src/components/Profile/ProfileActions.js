import request from 'services/request';
import config from 'config';
import type { ResponseType } from 'types/response.type';

class ProfileActions {
  connect(userId: string, note: string): Promise<ResponseType> {
    request.setContentType('application/json');
    const params = {
      user: userId,
      action: 'connect',
      note,
    };
    return request.post(`${config.services.user}/connections`, params)
      .then(() => {

      });
  }

  removeConnectionRequest(userId: string, note: string): Promise<ResponseType> {
    request.setContentType('application/json');
    const params = {
      user: userId,
      action: 'connection-requested',
      note,
    };
    return request.post(`${config.services.user}/connections`, params)
      .then(() => {
      });
  }

  removeConnection(userId: string, note: string): Promise<ResponseType> {
    request.setContentType('application/json');
    const params = {
      user: userId,
      action: 'remove-connection',
      note,
    };
    return request.post(`${config.services.user}/connections`, params)
      .then(() => {

      });
  }

  acceptConnection(userId: string, note: string): Promise<ResponseType> {
    request.setContentType('application/json');
    const params = {
      user: userId,
      action: 'accept-connection-request',
      note,
    };
    return request.post(`${config.services.user}/connections`, params)
      .then(() => {

      });
  }

  declineConnection(userId: string, note: string): Promise<ResponseType> {
    request.setContentType('application/json');
    const params = {
      user: userId,
      action: 'decline-connection-request',
      note,
    };
    return request.post(`${config.services.user}/connections`, params)
      .then(() => {

      });
  }

  follow(userId: string, note: string): Promise<ResponseType> {
    request.setContentType('application/json');
    const params = {
      user: userId,
      action: 'follow',
      note,
    };
    return request.post(`${config.services.user}/connections`, params)
      .then(() => {

      });
  }

  unFollow(userId: string): Promise<ResponseType> {
    request.setContentType('application/json');
    const params = {
      user: userId,
      action: 'unfollow',
    };
    return request.post(`${config.services.user}/connections`, params);
  }
}

export default new ProfileActions();
