import type { DataInterface } from 'type/socket/data.interface';
import MessageBroker from 'service/message-broker.service';

const sendToInitiative = (notes: string, meetingId: string) => {
  const messageBroker = new MessageBroker();
  const data = {
    service: 'initiative',
    action: 'add-meeting-notes',
    body: {
      notes,
      meetingId,
    },
  };

  messageBroker.produce('initiative', data).then().catch();
};

export default (server: any) => server
  .of('/meeting')
  .on('connection', (client: any) => {
    client.on('send', (data: DataInterface) => {
      client.in(data.channel).emit(data.event, data.data);
      sendToInitiative(data.data.text, data.channel);
    });
    client.on('join', (room: any) => {
      client.join(room);
    });
    client.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('[Message Action] Disconnected');
    });
  });
