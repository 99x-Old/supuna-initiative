import Router from '@koa/router';
import formatter from 'middleware/router/formatter.middleware';

import Error from 'error/user.error';
import update from './manage';
import setting from './setting';
import user from './user';
import kudos from './kudos';

let router = new Router();

router.use(formatter(true));

router = user(router);
router = update(router);
router = kudos(router);
const exportRouter = setting(router);

exportRouter.get('health', '/health', async (ctx: any) => {
  ctx.body = { status: 'working' };
  ctx.status = 200;
});

exportRouter.all('*', () => {
  throw new Error('Page not found!', 404);
});

export default exportRouter;
