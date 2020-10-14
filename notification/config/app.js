import dotenv from 'dotenv';

dotenv.config();

export default {
  message: {
    _from: 'you@nodefun.net',
    _reply_to: 'you@nodefun.net',
  },
  server: {
    _ssl: true,
    _host: 'smtp.mailtrap.io',
    _port: 465,
    _use_authentication: 'LOGIN',
    _username: 'b122d77b047253',
    _password: '26b97b07a14fae',
    _debug: false,
  },
  service: {
    user: `${process.env.USER_SERVICE}`,
    web: `${process.env.WEB_SERVICE}`,
    initiative: `${process.env.INITIATIVE_SERVICE}`,
  },
  kafka: 'ennoble-x-kafka:9092',
  db: `${process.env.CONNECTION_STRING}`,
};
