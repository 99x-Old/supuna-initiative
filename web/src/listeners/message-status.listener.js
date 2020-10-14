import Socket from '../services/request/socket';

export default (uuid: string, callback: any = () => {
}) => {
  const socket = new Socket('status');
  socket.disconnect(['message']);
  socket
    .join(`status:${uuid}`)
    .listen('message', async (data: {}) => {
      callback(data);
    });
  return socket;
};
export const disconnect = (socket: Socket) => {
  if (socket) {
    socket.disconnect(['message']);
  }
};
