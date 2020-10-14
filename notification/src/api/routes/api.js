import Router from '@koa/router';
import response from 'response/default.response';

import formatter from 'middleware/formatter.middleware';
import sample from './notification.router';

const router = new Router();
router.use(formatter(true));

const exportRouter = sample(router);

exportRouter.all('*', (ctx: any) => {
  ctx.body = response.response({ url: ctx.request.url }, 'Page not found');
  ctx.status = 404;
});

export default exportRouter;
