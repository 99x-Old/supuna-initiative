import io from 'socket.io';

export default (port: number = 5234) => io.listen(port);
