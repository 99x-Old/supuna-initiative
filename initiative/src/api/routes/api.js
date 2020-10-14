import Router from '@koa/router';
import response from 'response/default.response';
import formatter from 'middleware/router/formatter.middleware';

import initiative from './initiative.router';
import meta from './meta.router';
import initiativeYear from './initiative-year.router';
import initiativeReview from './initiative-review.router';
import rating from './initiative-rating.router';

let router = new Router();
router.use(formatter(true));

router = meta(router);
router = initiativeYear(router);
router = initiativeReview(router);
router = rating(router);

const exportRouter = initiative(router);

exportRouter.all('*', (ctx: any) => {
  ctx.body = response.response({ url: ctx.request.url }, 'Page not found!');
  ctx.status = 404;
});

export default exportRouter;
