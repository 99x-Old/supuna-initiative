const formatterMiddleware = () => async (ctx: any, next: any) => {
  const { headers } = ctx;

  if (headers['x-authenticated-userid']) {
    ctx.state.user = JSON.parse(headers['x-authenticated-userid']);
    ctx.state.authorized = true;
  } else {
    ctx.state.authorized = false;
  }
  await next();
};

export default formatterMiddleware;
