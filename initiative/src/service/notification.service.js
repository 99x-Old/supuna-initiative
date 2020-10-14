import Broker from './message-broker.service';

export default class NotificationService {
  sendNotification(text: any, to: any, from: any = null, options: any = {}) {
    if (to === from) return;
    const MessageBroker = new Broker();
    const data = {
      service: 'notification',
      action: 'notification:add',
      body: {
        text, to, from, options,
      },
    };

    MessageBroker.produce('notification', data).then().catch();
  }
}
