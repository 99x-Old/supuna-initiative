import User from 'service/user.service';

const formatterMiddleware = (onlyMain: boolean = false) => async (
  ctx: any,
  next: any,
) => {
  const { headers } = ctx;

  if (headers['x-authenticated-userid']) {
    const userService = new User();
    const useData = JSON.parse(headers['x-authenticated-userid']);
    ctx.state.user = await userService.getUserByUuid(useData.uuid, onlyMain);
    ctx.state.authorized = true;
  } else {
    ctx.state.authorized = false;
  }
  await next();
};

export default formatterMiddleware;
