import json from 'koa-json';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import errorHandler from 'error/main.error.handler';

import apiRouter from 'api/routes/api';

global.config = require('./config/app').default;
const app = new Koa();

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
