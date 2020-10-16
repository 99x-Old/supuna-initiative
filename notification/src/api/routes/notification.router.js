import shouldAuth from 'middleware/router/auth.middleware';
import response from 'response/default.response';
import NotificationService from 'service/notification.service';

export default (router: any) => {
  router.use(['/list', '/status'], shouldAuth());

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

  return router;
};
