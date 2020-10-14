import KudosRepository from 'repository/kudos.repository';
import type { UserMiniType } from '../type/user.type';
import type { UserRepositoryInterface } from '../repository/user.repository.interface';
import UserRepository from '../repository/user.repository';

export default class KudosService {
  repository: KudosRepository;

  userRepository: UserRepositoryInterface;

  _currentUser: UserMiniType;

  constructor() {
    this.repository = new KudosRepository();
    this.userRepository = new UserRepository();
  }

  set currentUser(value: string) {
    this._currentUser = value;
  }

  async list(): Promise<any> {
    return this.repository.list();
  }

  async give(userId: string, kudosId: string): Promise<any> {
    const kudos = await this.repository.get(kudosId);
    const user = await this.userRepository.getUserByUuid(userId);

    return this.repository
      .give(user._id, kudos._id, this._currentUser.id);
  }

  async getUserKudos(userId: string): Promise<any> {
    const user = await this.userRepository.getUserByUuid(userId);

    return this.repository
      .getUserKudos(user._id);
  }
}
