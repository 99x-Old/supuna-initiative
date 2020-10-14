import response from 'response/DefaultResponse';
import User from 'service/user.service';
import EmailService from 'service/email.service';
import shouldAuth from 'middleware/router/auth.middleware';
import SectionService from 'service/section/section.service';
import sectionDataMiddleware from '../../middleware/section/section.data.middleware';
import type { ContentType } from '../../type/section.type';
import type { UserMiniType, UserType } from '../../type/user.type';

export default (router: any) => {
  router.use(['/status/auth'], shouldAuth());
  router.get('auth-check', '/status/auth', async (ctx: any) => {
    ctx.body = { status: 'working' };
    ctx.status = 200;
  });

  router.post('add-user', '/users', async (ctx: any) => {
    const userService = new User();
    await userService.add(ctx.request.body).then((data: UserType | UserMiniType) => {
      ctx.body = response.response(data);
    });
  });

  router.get('get-user', '/users/:id/:onlyMain?', async (ctx: any) => {
    const userService = new User();
    userService.currentUser = ctx.state.user;
    await userService
      .getUserByUuid(ctx.params.id, ctx.params.onlyMain)
      .then((tokenObject) => {
        ctx.body = response.response(tokenObject);
      });
  });

  router.get('get-users', '/users/get/list/:ids', async (ctx: any) => {
    const ids = ctx.params.ids.split(',');
    const userService = new User();
    userService.currentUser = ctx.state.user;
    const userList = await userService
      .getUsers(ids);
    ctx.body = response.response(userList);
  });

  router.delete('delete-user', '/users/:id', async (ctx: any) => {
    const userService = new User();
    userService.currentUser = ctx.state.user;
    await userService
      .deleteUser(ctx.params.id)
      .then((data: any) => {
        ctx.body = response.response(data);
      });
  });

  router.get('get-user-by-email', '/users/get/email/:email/:onlyMain?', async (ctx: any) => {
    const userService = new User();
    userService.currentUser = ctx.state.user;
    await userService
      .getUserByEmail(ctx.params.email, ctx.params.onlyMain)
      .then((tokenObject) => {
        ctx.body = response.response(tokenObject);
      });
  });

  router.post('verify-user', '/users/verify', async (ctx: any) => {
    const userService = new User();
    const { username } = ctx.request.query;
    const { password } = ctx.request.query;

    await userService.verifyLogin(username, password).then((tokenObject) => {
      const { data, message } = tokenObject;
      ctx.body = response.response(data, message);
    });
  });

  router.post('add-user-status', '/users/set/status/:id', async (ctx: any) => {
    const userService = new User();
    const { username } = ctx.request.body;
    const { password } = ctx.request.body;
    await userService
      .verifyLogin(username, password)
      .then((tokenObject) => {
        const { data, message } = tokenObject;

        ctx.body = response.response(data, message);
      })
      .catch((errData) => {
        const { data, message, status } = errData;
        ctx.body = response.response(data, message);
        ctx.status = status;
      });
  });

  router.get('validate', '/validate', async (ctx: any) => {
    const { code } = ctx.request.query;
    const { email } = ctx.request.query;

    const userService = new User();
    const emailService = new EmailService(userService);

    await emailService.verifyEmail(email, code).then((verificationObject) => {
      const { data, message } = verificationObject;
      ctx.body = response.response(data, message);
    });
  });

  router.get('search-users', '/users', async (ctx: any) => {
    const userService = new User();
    const params = ctx.request.query;
    params.filters = JSON.parse(params.filters ?? '{}');

    await userService.search(params).then((list: any) => {
      ctx.body = response.response(list);
    });
  });

  router.put('update-user-details', '/users', async (ctx: any) => {
    const params = ctx.request.body;
    params.roles = params.roles?.map((role: any) => role.value);

    const userService = new User();
    userService.currentUser = ctx.state.user;
    const updatedUser = await userService.update(params);

    ctx.body = response.response(updatedUser);
  });

  router.get('get-roles', '/role', async (ctx: any) => {
    const userService = new User();
    await userService.getRoles().then((data: any) => {
      ctx.body = response.response(data);
    });
  });

  router.get('get-sections', '/sections', async (ctx: any) => {
    const sectionService = new SectionService();
    const { userId } = ctx.request.query;
    await sectionService.getSections(userId)
      .then((sections: ContentType[]) => sections
        .map((section: ContentType) => sectionDataMiddleware()(section)))
      .then((data: any) => {
        ctx.body = response.response(data);
      });
  });

  return router;
};
