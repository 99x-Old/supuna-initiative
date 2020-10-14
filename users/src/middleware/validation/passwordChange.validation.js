import Error from 'error/user.error';

const PasswordChangeValidation = () => async (ctx: any, next: any) => {
  const settingArray = ctx.request.body;

  if (!settingArray.current_password) {
    throw new Error('Current Password is not set!', 422);
  }
  if (!settingArray.new_password) {
    throw new Error('New Password is not set!', 422);
  }
  if (Object.keys(settingArray).length !== 2) {
    throw new Error('Invalid number of values!', 422);
  }
  await next();
};

export default PasswordChangeValidation;
