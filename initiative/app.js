import dotenv from 'dotenv';
import json from 'koa-json';
import Koa from 'koa';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import errorHandler from 'error/main.error.handler';

import apiRouter from 'api/routes/api';
import consumerListener from './src/listeners/consumer.listener';

const app = new Koa();
dotenv.config();
global.config = require('./config/app').default;

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

// Error handling
app.use(errorHandler());

// Middlewares
app.use(json());
app.use(bodyParser());

// Listeners
consumerListener();

// Routes
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());
module.exports = app;
