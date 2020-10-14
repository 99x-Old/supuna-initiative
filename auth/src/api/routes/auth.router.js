import response from 'response/default.response';
import AuthService from 'service/auth.service';

export default (router: any) => {
  router.get('/check', (ctx: any) => {
    if (ctx.state.authorized) {
      ctx.body = response.response(ctx.state.user);
    } else {
      ctx.body = response.response(false);
    }
    ctx.status = 200;
  });

  router.post('/api/auth/get', (ctx: any) => {
    if (ctx.state.authorized) {
      ctx.body = response.response(ctx.state.user);
    } else {
      ctx.body = response.response(false);
    }
    ctx.status = 200;
  });

  /** GET users listing. */
  router.post('/api/auth', async (ctx: any) => {
    const authService = new AuthService();
    const userAgent = ctx.get('User-Agent');
    const { username } = ctx.request.body;
    const { password } = ctx.request.body;

    await authService.auth(username, password, { userAgent }).then((data: {}) => {
      ctx.body = response.response(data);
    });
  });

  router.get('/api/auth', async (ctx: any) => {
    const authService = new AuthService();
    const { authorizationCode } = ctx.request.query;

    await authService.getTokenByCode(authorizationCode).then((data: {}) => {
      ctx.body = response.response(data);
    });
  });

  return router;
};
