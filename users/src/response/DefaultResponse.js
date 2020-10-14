exports.response = function (data, message = 'Successful!') {
  const body = {};
  body.data = data;
  body.message = message;
  return body;
};
