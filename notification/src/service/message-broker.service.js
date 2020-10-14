import { v4 as uuid4 } from 'uuid';
import { CompressionTypes } from 'kafkajs';
import sendMonthlyNewsletter from './mails/monthly-newsletter.mail';
import messageActions from './message.actions';
import NotificationService from './notification.service';
import { sendMessage as sendStatusMessage } from './socket/actions/status.action';

const { Kafka, logLevel } = require('kafkajs');

export default class MessageBroker {
  socket;

  notification: NotificationService;

  constructor(options: any) {
    this.kafka = new Kafka({
      clientId: 'ennoble-x-notification',
      brokers: [global.config.kafka],
      logLevel: logLevel.ERROR,
    });
    this.socket = options?.socket;
    this.notification = new NotificationService();
  }

  async consume(topicName: string, groupId: string, callback: any) {
    const consumer = this.kafka.consumer({ groupId });

    await consumer.connect();
    // eslint-disable-next-line no-console
    console.log('Consumer connected!');

    await consumer.subscribe({ topic: topicName, fromBeginning: false });
    // eslint-disable-next-line no-console
    console.log('Consumer subscribed!');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        callback({ topic, partition, message });
      },
    }).then(() => {
      // eslint-disable-next-line no-console
      console.log('Consumer started!');
    });
  }

  handle(action: string, data: any) {
    switch (action) {
      case messageActions.SEND_MONTHLY_NEWS_LETTER:
        sendMonthlyNewsletter([data.body.to]);
        break;
      case messageActions.ADD_NOTIFICATION:
        this.notification.add({
          uuid: uuid4(),
          text: data.body.text,
          to_user: data.body.to,
          from_user: data.body.from,
          options: data.body.options,
        });
        sendStatusMessage(this.socket, [data.body.to], data);
        break;
      default:
        throw new Error('Invalid action!');
    }
  }

  async produce(topicName: string, message: string) {
    const producer = this.kafka.producer();

    await producer.connect();
    await producer.send({
      topic: topicName,
      compression: CompressionTypes.GZIP,
      messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
  }
}
