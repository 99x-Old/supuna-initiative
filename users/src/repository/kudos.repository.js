import Kudos from '../model/kudos';
import UserKudos from '../model/user_kudos';

export default class KudosRepository {
  /**
   * Add Kudos
   * @returns {Promise<*>}
   * @param userId
   * @param kudosId
   * @param givenBy
   */
  async give(userId: string, kudosId: string, givenBy: string): any {
    const kudos = new UserKudos({
      kudos: kudosId,
      user: userId,
      givenBy,
    });
    return kudos.save();
  }

  async list(): any {
    return Kudos.find({});
  }

  async get(id: string): any {
    return Kudos.findOne({ uuid: id });
  }

  async getUserKudos(id: string): any {
    return UserKudos.find({ user: id })
      .populate('kudos')
      .populate('givenBy')
      .populate('user');
  }
}
