import SectionRepository from 'repository/section.repository';
import UserRepository from 'repository/user.repository';
import type { UserMiniType } from '../../type/user.type';

export default class SectionService {
  repository: SectionRepository;

  constructor() {
    this.repository = new SectionRepository();
  }

  async getSections(userId: string): any {
    const userRepository = new UserRepository();
    const user = await userRepository.getUserByUuid(userId);
    return this.repository.getSections(user?._id);
  }

  async updatePositions(user: UserMiniType, positions: any): any {
    return await this.repository.updatePositions(user.id, positions);
  }
}
