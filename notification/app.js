import json from 'koa-json';
import errorHandler from 'error/main.error.handler';
import apiRouter from 'api/routes/api';
import mongoose from 'mongoose';
import consumerListener from './src/listeners/consumer.listener';
import socketListener from './src/listeners/socket.listener';
import socketServer from './src/service/socket/server';
import schedulerListener from './src/listeners/scheduler.listener';

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const app = new Koa();

// socket server
const io = socketServer();

global.config = require('./config/app.js').default;

// error handling
app.use(errorHandler());

// Database
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database at ${global.config.db}`);
});
mongoose.connect(global.config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
// eslint-disable-next-line no-console
}).then(() => console.log('Mongodb is connected!'));
mongoose.set('useCreateIndex', true);

// uses
app.use(json());
app.use(bodyParser());
consumerListener({ socket: io });
socketListener(io);
schedulerListener();

// Error handling
app.use(errorHandler());

// Middlewares
app.use(json());
app.use(bodyParser());

// Routes
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.listen(process.env.PORT);
// eslint-disable-next-line no-console
console.log(`Koa listening on port ${process.env.PORT}`);
