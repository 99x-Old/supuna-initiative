import { v4 as uuid4 } from 'uuid';
import userDataMiddleware from '../middleware/data/user.middleware';
import EmailService from './email.service';

import UserRepository from '../repository/user.repository';
import { UserRepositoryInterface } from '../repository/user.repository.interface';
import type { UserServiceInterface } from './user.service.interface';
import type { UserMiniType, UserType } from '../type/user.type';
import Error from '../error/user.error';
import NotificationService from './notification.service';

export default class UserService implements UserServiceInterface {
  repository: UserRepositoryInterface;

  constructor() {
    this.repository = new UserRepository();
  }

  _currentUser: UserMiniType;

  set currentUser(value: string) {
    this._currentUser = value;
  }

  async add(params: any): Promise<UserMiniType | UserType> {
    const data = params;
    data.uuid = uuid4();

    const newUser = await this.repository
      .save(data)
      .then((user: {}) => {
        const emailService = new EmailService(this);
        emailService.sendConfirmation(user.email, user);
        return user;
      });

    return this.getUserByUuid(newUser.uuid);
  }

  async update(params: any): Promise<UserMiniType | UserType> {
    if (params.uuid === this._currentUser.uuid && params.status === false) {
      throw new Error('You can\'t deactivate your self!', 422);
    }
    await this.repository.update(params);

    const notificationService = new NotificationService();
    notificationService.sendNotification(`Your setting has been updated by ${this._currentUser.first_name}`, params.uuid);

    return this.getUserByUuid(params.uuid);
  }

  async verifyLogin(username: string, password: string) {
    const dataObject = {};

    return this.repository
      .getUserByLogin(username, password)
      .then(userDataMiddleware(true))
      .then((data: UserType | UserMiniType) => {
        dataObject.data = data;
        dataObject.status = 200;
        dataObject.headers = {};
        dataObject.message = 'Successful!';
        return dataObject;
      });
  }

  async getUserByUuid(uuid: string, onlyMain: boolean = false): UserType | UserMiniType {
    return this.repository
      .getUserByUuid(uuid)
      .then(userDataMiddleware(onlyMain));
  }

  async getUsers(userIds: string[]): UserType | UserMiniType {
    return this.repository
      .getUsers(userIds)
      .then((users: UserType[]) => users
        .map((user: UserType) => userDataMiddleware(false)(user)));
  }

  async deleteUser(uuid: string): UserType | UserMiniType {
    if (uuid === this._currentUser.uuid) {
      throw new Error('You can\'t delete your self!', 422);
    }

    return this.repository
      .deleteUser(uuid)
      .then(userDataMiddleware());
  }

  async getUserByEmail(email: string, onlyMain: boolean = false): UserType | UserMiniType {
    return this.repository
      .getUserByEmail(email)
      .then(userDataMiddleware(onlyMain));
  }

  async setUserStatus(userId: string, status: string) {
    return this.repository
      .getStatusByName(status)
      .then((statusObject) => this.repository.setUserStatus(userId, statusObject._id));
  }

  async search(param: any) {
    return this.repository.search(param)
      .then((data: any) => {
        const reformatted = data;
        reformatted.list = reformatted
          .list.map((userItem: UserType) => userDataMiddleware()(userItem));
        return reformatted;
      });
  }

  async getRoles() {
    return this.repository.getRoles();
  }
}
