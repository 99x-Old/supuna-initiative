const formatterMiddleware = () => async (ctx, next) => {
  const { headers } = ctx;
  if (headers['x-authenticated-userid']) {
    ctx.state.authorized = true;
    ctx.state.user = JSON.parse(headers['x-authenticated-userid']);
  } else {
    ctx.state.authorized = false;
  }

  await next();
};

export default formatterMiddleware;
