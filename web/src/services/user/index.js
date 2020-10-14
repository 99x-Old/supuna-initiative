import config from 'config';
import type { ResponseType } from 'types/response.type';
import request from 'services/request';

export default class UserService {
  getProfile(userId: string): Promise<ResponseType> {
    return request.get(`${config.services.user}/users/${userId}`);
  }
}
