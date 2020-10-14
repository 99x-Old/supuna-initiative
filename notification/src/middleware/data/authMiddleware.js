export default () => (headers: any) => {
  if (headers['x-authenticated-userid']) {
    const user = JSON.parse(headers['x-authenticated-userid']);
    user.authorized = true;
    return user;
  }
  return {};
};
