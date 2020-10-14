import InitiativeRepository from 'repository/initiative.repository';
import InitiativeYearRepository from '../repository/initiative-year.repository';
import InitiativeReviewRepository from '../repository/initiative-review.repository';
import type { InitiativeType } from '../type/initiative.type';
import cycleMiddleware from '../middleware/data/cycle.middleware';

export default class InitiativeReviewService {
  repository: InitiativeRepository;

  repositoryYear: InitiativeYearRepository;

  repositoryReview: InitiativeReviewRepository;

  constructor() {
    this.repository = new InitiativeRepository();
    this.repositoryYear = new InitiativeYearRepository();
    this.repositoryReview = new InitiativeReviewRepository();
  }

  async getReviewCycle(id: string): Promise<InitiativeType[]> {
    return this.repositoryReview.getCycle(id).then(cycleMiddleware());
  }

  async list(): Promise<InitiativeType[]> {
    const yearData = await this.repositoryYear.getCurrentYear();
    return this.repositoryReview.getCycles(yearData._id);
  }

  async addInitiative(
    cycle: string,
    initiative: string,
    ratings: any,
    notes: any,
    contributors: any,
  ): Promise<InitiativeType[]> {
    const cycleData = await this.repositoryReview.getCycle(cycle);
    const initiativeData = await this.repository.get(initiative);

    const evaluationCriteriaData = await Promise.all(Object.keys(notes)
      .map(async (criteriaId: string) => {
        const criteria = await this.repositoryReview.getEvaluationCriteria(criteriaId);
        return {
          criteria: criteria._id,
          note: notes[criteriaId],
          points: ratings[criteriaId] ?? 0,
        };
      }));

    await this.repositoryReview.addReviews(
      cycleData._id,
      initiativeData._id,
      evaluationCriteriaData,
    );

    let contributorsData = [];

    Object.keys(contributors).forEach((user: string) => {
      contributorsData = [...contributorsData, {
        user,
        feedback: contributors[user],
      }];
    });
    await this.repositoryReview.addKeyContributors(
      cycleData._id,
      initiativeData._id,
      contributorsData,
    );
  }

  async publishCycle(id: string): Promise<any> {
    await this.repositoryReview.publishCycle(id);
    return this.getReviewCycle(id);
  }
}
