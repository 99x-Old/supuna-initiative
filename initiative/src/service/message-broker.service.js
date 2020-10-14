import { CompressionTypes } from 'kafkajs';
import messageActions from './message.actions';
import InitiativeService from './initiative.service';

const { Kafka } = require('kafkajs');

export default class MessageBroker {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'ennoble-x-notification',
      brokers: [global.config.kafka],
    });
  }

  async consume(topicName: string, groupId: string, callback: any) {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic: topicName, fromBeginning: false });

    await consumer
      .run({
        eachMessage: async ({ topic, partition, message }: any) => {
          callback({ topic, partition, message });
        },
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Consumer started!');
      });
  }

  async produce(topicName: string, message: any) {
    const producer = this.kafka.producer();

    await producer.connect();
    await producer.send({
      topic: topicName,
      compression: CompressionTypes.GZIP,
      messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
  }

  handle(action: string, data: any) {
    const initiativeService = new InitiativeService();

    switch (action) {
      case messageActions.ADD_MEETING_NOTE:
        initiativeService
          .updateMeetingNotes(data.body.meetingId, data.body.notes)
          .then();
        break;
      default:
        throw new Error('Invalid action!');
    }
  }
}
