import InitiativeRepository from 'repository/initiative.repository';
import type { InitiativeType } from 'type/initiative.type';
import departmentMiddleware from 'middleware/data/department.middleware';
import Department from './item/department';
import MetaRepository from '../repository/meta.repository';
import InitiativeReviewRepository from '../repository/initiative-review.repository';

export default class MetaService {
  repository: InitiativeRepository;

  _metaRepository: MetaRepository;

  _reviewRepository: InitiativeReviewRepository;

  constructor() {
    this._metaRepository = new MetaRepository();
    this._reviewRepository = new InitiativeReviewRepository();
    this.repository = new InitiativeRepository();
  }

  /**
   * get departments
   * @returns {Promise<InitiativeType>}
   */
  async getDepartments(): Promise<InitiativeType[]> {
    return this._metaRepository
      .getDepartments()
      .then((departments: any[]) => departments
        .map((department: any) => departmentMiddleware()(department)));
  }

  /**
   * add department
   * @returns {Promise<InitiativeType>}
   */
  async addDepartment(department: Department): Promise<InitiativeType[]> {
    await department.add();
    return department.getResults();
  }

  /**
   * get status
   * @returns {Promise<any>}
   */
  async getStatus(): Promise<any[]> {
    const data = {};
    data.topUsers = await this._metaRepository.getTopMembers();
    data.upcomingCycle = await this._reviewRepository.getUpcomingCycles();
    return data;
  }
}
