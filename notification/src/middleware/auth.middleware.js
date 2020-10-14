const authMiddleware = () => async (ctx, next) => {
  await next();

  if (!ctx.state.authorized) {
    ctx.throw(401, 'Unauthorized');
  }
};

export default authMiddleware;
