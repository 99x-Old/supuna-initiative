import Socket from '../service/socket/socket.service';

const socketListener = (io: any) => {
  const socket = new Socket(io);
  // eslint-disable-next-line no-console
  console.log('Listening socket connection...');
  socket.listen();
};

export default socketListener;
