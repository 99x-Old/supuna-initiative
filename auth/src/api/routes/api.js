import Router from '@koa/router';
import response from 'response/default.response';

import formatter from 'middleware/formatter.middleware';
import auth from './auth.router';
import authMicrosoft from './authMicrosoft.router';

let router = new Router();
router.use(formatter(true));

router = authMicrosoft(router);
const exportRouter = auth(router);

exportRouter.all('*', (ctx: any) => {
  ctx.body = response.response({ url: ctx.request.url }, 'Page not found');
  ctx.status = 404;
});

export default exportRouter;
