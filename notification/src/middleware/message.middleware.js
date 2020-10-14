const messageMiddleware = (message) => {
  const data = message();

  return data;
};

export default messageMiddleware;
