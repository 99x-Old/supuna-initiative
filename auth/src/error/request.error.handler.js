import authError from './auth.error';

export default (error) => {
  const status = error.response ? error.response.status : 500;
  switch (status) {
    case 403:
      throw new authError(error.response.data.message, 401, error.response.data);
    case 401:
      throw new authError(error.response.data.message, 401, error.response.data);
    case 404:
      throw new authError('Page not found', 401, error.response.data);
    default:
      throw new authError(error, status, {});
  }
};
