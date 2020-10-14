export default (headers: {}) => {
  if (headers['x-authenticated-userid']) {
    try {
      return JSON.parse(headers['x-authenticated-userid']);
    } catch (e) {
      return false;
    }
  }
  return false;
};
