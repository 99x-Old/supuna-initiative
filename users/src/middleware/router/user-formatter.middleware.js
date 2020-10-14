const userFormatterMiddleware = () => async (ctx, next) => {
  await next();
};

export default userFormatterMiddleware;
