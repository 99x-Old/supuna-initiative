import type { DataInterface } from 'type/socket/data.interface';

export default (server: any) => server
  .of('/feed')
  .on('connection', (client: any) => {
    client.on('send', (data: DataInterface) => {
      client.in(data.channel).emit(data.event, data.data);
    });
    client.on('join', (room: any) => {
      client.join(room);
    });
    client.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('[Message Action] Disconnected');
    });
  });
