import Error from 'error/user.error';
import type { UserType, UserMiniType } from 'type/user.type';

const userDataMiddleware = (
  onlyMain: boolean = false,
  onlyActive: boolean = true,
) => (user: any) => {
  if (!user) {
    throw new Error('User not found!', 400);
  }
  if (onlyActive) {
    if (user?.status?.status === 'pending') {
      throw new Error('Pending email confirmation!', 401);
    }
  }

  if (onlyMain) {
    const miniData: UserMiniType = {
      oid: user.oid,
      id: user._id,
      uuid: user.uuid,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      status: user.status.status === 'active',
    };
    return miniData;
  }

  const data: UserType = {
    oid: user.oid,
    uuid: user.uuid,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    bio: user.bio,
    mobile: user.mobile,
    role: user.role,
    status: user.status.status === 'active',
  };
  return data;
};

export default userDataMiddleware;
