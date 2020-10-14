import authMiddleware from 'middleware/data/authMiddleware';

export default (server: any) => {
  const status = server.of('/status')
    .use(async (socket: any, next: any) => {
      const user = authMiddleware()(socket.handshake.headers);
      if (user.authorized) {
        // eslint-disable-next-line no-param-reassign
        socket.user = user;
        next();
      } else {
        next(new Error('Unauthorized'));
      }
    });

  status.on('connection', (client: any) => {
    console.log(`[Status Action] ${client.user.uuid} Connected to Status!`);
    client.join(`status-${client.user.uuid}`);
    client.on('disconnect', () => {
      console.log('[Status Action] Disconnected');
    });
  });
};

export const sendMessage = (server: any, rooms: [], data: any) => {
  const status = server.of('/status');
  rooms.map((room: any) => status.to(`status-${room}`).emit('status-updated', data));
};
