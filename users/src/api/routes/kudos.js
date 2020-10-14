import shouldAuth from 'middleware/router/auth.middleware';
import response from '../../response/DefaultResponse';
import KudosService from '../../service/kudos.service';

export default (router: any) => {
  router.use(['/kudos/*'], shouldAuth());

  router.get('list-kudos', '/kudos', async (ctx: any) => {
    const kudosService = new KudosService();
    const list = await kudosService.list();
    ctx.body = response.response(list);
  });

  router.post('add-user-kudos', '/kudos/:kudosId/:userId', async (ctx: any) => {
    const { userId, kudosId } = ctx.params;

    const kudosService = new KudosService();
    kudosService.currentUser = ctx.state.user;
    const list = await kudosService.give(userId, kudosId);
    ctx.body = response.response(list);
  });

  router.get('get-user-kudos', '/kudos/:userId', async (ctx: any) => {
    const { userId } = ctx.params;
    const kudosService = new KudosService();
    const list = await kudosService.getUserKudos(userId);
    ctx.body = response.response(list);
  });

  return router;
};
