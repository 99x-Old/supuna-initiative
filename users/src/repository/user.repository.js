import mongoose from 'mongoose';
import User from '../model/user';
import Password from '../model/password';
import UserStatus from '../model/user_status';
import Status from '../model/status';
import Error from '../error/user.error';
import { type UserRepositoryInterface } from './user.repository.interface';
import UserMiddleware from './middleware/user.mongo.middleware';
import type { UserType } from '../type/user.type';
import Role from '../model/role';

const bcrypt = require('bcrypt');

export default class UserRepository implements UserRepositoryInterface {
  /**
   * Add User
   * @param param
   * @returns {Promise<*>}
   */
  async save(param: UserType | any): UserType {
    const role = await this.getRole('user');
    const userData = {
      first_name: param.first_name,
      last_name: param.last_name,
      bio: param.bio,
      birth: param.birth,
      email: param.email,
      mobile: param.mobile,
      gender: param.gender,
      uuid: param.uuid,
      oid: param.oid ?? null,
      created_at: param.created_at,
      updated_at: param.updated_at,
      role: [role._id],
    };

    const user = new User(userData);
    await user.save();

    const Pending = await this.getStatusByName('active');
    const statusData = { status: Pending._id, user: user._id };
    const userStatus = new UserStatus(statusData);
    await userStatus.save();

    return user;
  }

  /**
   * Update user
   * @param params
   * @returns {Promise<void|Query>}
   */
  async update(params: UserType | any): UserType {
    const userData = {
      first_name: params.first_name,
      last_name: params.last_name,
      role: params.roles.map((roleId: string) => mongoose.Types.ObjectId(roleId)),
    };

    const updatedUser = await User.findOneAndUpdate(
      { uuid: params.uuid },
      userData,
    );

    const status = await this.getStatusByName(params.status === true ? 'active' : 'deactivate');
    const statusData = { status: status._id, user: updatedUser._id };

    await UserStatus.findOneAndUpdate(
      { user: updatedUser._id },
      statusData,
    );

    return updatedUser;
  }

  getRole(role: string): any {
    return Role.findOne({ role })
      .exec();
  }

  get(id: any): any {
    return User.findById(id)
      .populate('role')
      .populate('status')
      .exec();
  }

  async getUserByUuid(uuid: any): UserType {
    return User.aggregate([{ $match: { uuid } }, ...UserMiddleware]).then(
      (item: []) => item[0],
    );
  }

  async getUsers(ids: any): UserType {
    return User.aggregate([{ $match: { uuid: { $in: ids } } }, ...UserMiddleware]);
  }

  async deleteUser(uuid: any): UserType {
    return User.deleteOne({ uuid });
  }

  async getUserByEmail(email: any): UserType {
    return User.aggregate([{ $match: { email } }, ...UserMiddleware]).then(
      (item: []) => item[0],
    );
  }

  getStatusByName(statusName: string): Promise<any> {
    return Status.findOne({ status: statusName }).exec();
  }

  getUserStatus(userId: string): Promise<any> {
    return UserStatus.findOne({ user: userId })
      .sort({ _id: 'desc' })
      .populate('status')
      .exec();
  }

  /**
   * Get User By Login
   * @param username
   * @param password
   * @returns {Promise<*>}
   */
  async getUserByLogin(username: string, password: string): UserType {
    const self = this;
    return User.findOne({ email: username })
      .exec()
      .then((user: any) => {
        if (!user) {
          throw new Error('User not exist!', 401);
        }
        return self.getPasswordById(user._id).then((passwordData: any) => bcrypt
          .compare(password, passwordData.password)
          .then((result: any) => {
            if (result) {
              return self.getUserStatus(user._id)
                .then((userStatus: any) => ({ ...user.toObject(), status: userStatus }));
            }
            throw new Error('Invalid user credential!', 401);
          }));
      });
  }

  async getPasswordById(userId: string): Promise<any> {
    return Password.findOne({ user: userId, active: true })
      .sort({ _id: 'desc' })
      .exec();
  }

  async setUserStatus(userId: string, status: string): Promise<any> {
    const data = {
      status,
      user: userId,
    };
    const userStatus = new UserStatus(data);
    await userStatus.save();

    return User.update({ _id: userId }, { $push: { status: userStatus._id } });
  }

  async updateBio(uuid: string, bio: string): Promise<any> {
    const user = await User.findOne({ uuid });
    user.bio = bio;
    await user.save();
    return user;
  }

  async getRoles(): any {
    return Role.find({}).exec();
  }

  async search(param: any): any {
    const query = { $and: [] };
    const limit = param.limit ? parseInt(param.limit, 10) : 5;
    const page = param.page ? parseInt(param.page, 10) : 1;
    const skip = (page - 1) * limit;

    if (param.q) {
      const nameQuery = { $or: [] };
      nameQuery.$or.push({
        first_name: {
          $regex: `^${param.q}`,
          $options: 'i',
        },
      });
      nameQuery.$or.push({
        last_name: {
          $regex: `^${param.q}`,
          $options: 'i',
        },
      });
      nameQuery.$or.push({
        bio: {
          $regex: `.*${param.q}.*`,
          $options: 'i',
        },
      });

      query.$and.push(nameQuery);
    }

    if (!query.$and.length) {
      delete query.$and;
    }

    return User.aggregate([
      { $match: query },
      ...UserMiddleware,
      { $unset: 'last' },
      {
        $facet: {
          meta: [{ $count: 'total' }, { $addFields: { page } }],
          list: [{ $skip: skip }, { $limit: limit }],
        },
      },
      {
        $addFields: {
          total: {
            $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0],
          },
          page: {
            $ifNull: [{ $arrayElemAt: ['$meta.page', 0] }, 0],
          },
          pages: {
            $ceil: { $divide: [{ $arrayElemAt: ['$meta.total', 0] }, limit] },
          },
        },
      },
      { $unset: ['meta'] },
    ])

      .exec()
      .then((d: []) => d[0]);
  }
}
