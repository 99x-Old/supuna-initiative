import InitiativeYearRepository from 'repository/initiative-year.repository';
import InitiativeYearMiddleware from 'middleware/data/initiative-year.middleware';
import type { InitiativeType } from 'type/initiative.type';

export default class InitiativeYearService {
  repository: InitiativeYearRepository;

  constructor() {
    this.repository = new InitiativeYearRepository();
  }

  /**
   * add initiative year
   * @returns {Promise<InitiativeType>}
   */
  async list(): Promise<InitiativeType[]> {
    return this.repository
      .list()
      .then((list: any) => list
        .map((listItem: any) => InitiativeYearMiddleware()(listItem)));
  }

  /**
   * get initiative year
   * @returns {Promise<InitiativeType>}
   */
  async get(id: string): Promise<InitiativeType[]> {
    return this.repository
      .get(id)
      .then(InitiativeYearMiddleware());
  }

  /**
   * get initiative year
   * @returns {Promise<InitiativeType>}
   */
  async getCurrentYear(): Promise<InitiativeType[]> {
    const year = await this.repository.getCurrentYear();
    return this.get(year.uuid);
  }

  /**
   * delete initiative year
   * @returns {Promise<InitiativeType>}
   */
  async delete(id: string): Promise<InitiativeType[]> {
    return this.repository
      .delete(id)
      .then(InitiativeYearMiddleware());
  }

  /**
   * delete initiative year
   * @returns {Promise<InitiativeType>}
   */
  async deleteInitiative(id: string, yearId: string): Promise<InitiativeType[]> {
    return this.repository
      .deleteInitiative(id, yearId);
  }

  /**
   * Set initiative objectives
   * @returns {Promise<InitiativeType>}
   */
  async setInitiativeObjective(
    id: string,
    note: string,
    yearId: string,
  ): Promise<InitiativeType[]> {
    let year = yearId;
    if (!year) {
      const yearData = await this.repository.getCurrentYear();
      year = yearData.uuid;
    }
    return this.repository
      .setInitiativeObjective(id, year, note);
  }
}
