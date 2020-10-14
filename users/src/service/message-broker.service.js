import { CompressionTypes } from 'kafkajs';

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
    console.log('Consumer connected!');

    await consumer.subscribe({ topic: topicName, fromBeginning: false });
    console.log('Consumer subscribed!');

    await consumer
      .run({
        eachMessage: async ({ topic, partition, message }) => {
          callback({ topic, partition, message });
        },
      })
      .then(() => {
        console.log('Consumer started!');
      });
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
