import { v4 as uuid } from 'uuid';
import Broker from 'service/message-broker.service';

const consumerListener = (options: any) => {
  // eslint-disable-next-line no-console
  console.log('Applying consumer middleware..');
  const messageBroker = new Broker(options);
  messageBroker.consume('notification', `notification-${uuid()}`, (data: any) => {
    const { message } = data;
    const messageData = JSON.parse(message.value.toString());

    messageBroker.handle(messageData.action, messageData);
  }).then();
};

export default consumerListener;
