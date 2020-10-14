import shouldAuth from 'middleware/router/auth.middleware';
import response from 'response/default.response';
import NotificationService from 'service/notification.service';

export default (router: any) => {
  router.use(['/list', '/status'], shouldAuth());

  router.get('hello-world', '/', async (ctx: any) => {
    ctx.body = response.response({ a: 'Hello Koa!', b: 'Created by Lifeeka' }, 'Success message!');
    ctx.status = 200;
  });

  router.get('list', '/list', async (ctx: any) => {
    const notificationService = new NotificationService();
    const list = await notificationService.list(ctx.state.user.uuid);
    ctx.body = response.response(list);
    ctx.status = 200;
  });

  router.get('count', '/status', async (ctx: any) => {
    const notificationService = new NotificationService();
    const list = await notificationService.status(ctx.state.user.uuid);
    ctx.body = response.response(list);
    ctx.status = 200;
  });

  router.post('add-sample', '/sample', async (ctx: any) => {
    const sample = new NotificationService();

    const { body } = ctx.request;
    const sampleContent = await sample.save(body);

    ctx.body = response.response(sampleContent);
    ctx.status = 200;
  });

  return router;
};
