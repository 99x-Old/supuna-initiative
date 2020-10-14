import Broker from './message-broker.service';
import type { UserServiceInterface } from './user.service.interface';
import type { UserType } from '../type/user.type';

export default class NotificationService {
  userService: UserServiceInterface;

  constructor(userService: UserServiceInterface) {
    this.userService = userService;
  }

  sendNotification(text: any, to: UserType, from: UserType = null) {
    if (to === from) return;
    const MessageBroker = new Broker();
    const data = {
      service: 'notification',
      action: 'notification:add',
      body: {
        text, to, from,
      },
    };
    MessageBroker.produce('notification', data).then().catch();
  }
}
