import InitiativeReviewCycleModel from '../model/initiative-year-review-cycle.model';
import InitiativeYearReviewCycleReviewModel from '../model/initiative-year-review-cycle-key-contributors.model';
import InitiativeReviewCycleEvaluationCriteriaModel
  from '../model/initiative-year-review-cycle-evaluation_criteria.model';
import InitiativeEvaluationCriteria from '../model/initiative-evaluation-criteria.model';

export default class InitiativeReviewRepository {
  /**
   * Add Initiative review cycle
   * @param param
   * @returns {Promise<Array>}
   */
  async add(param: any): Promise<Array> {
    const data = {
      uuid: param.uuid,
      title: param.title,
      year: param.year,
      duration: param.duration,
      description: param.description,
    };
    const reviewCycleModel = new InitiativeReviewCycleModel(data);
    return reviewCycleModel.save();
  }

  async getCycle(uuid: string): Promise<Array> {
    return InitiativeReviewCycleModel.aggregate([
      { $match: { uuid } },
      {
        $lookup:
            {
              from: 'initiative_year_review_cycle_evaluation_criteria',
              let: { cycleId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$cycle', '$$cycleId'] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: 'initiatives',
                    let: { initiativesId: '$initiative' },
                    pipeline: [
                      { $match: { $expr: { $eq: ['$_id', '$$initiativesId'] } } },
                    ],
                    as: 'initiative',
                  },
                },
                { $unwind: '$initiative' },
              ],
              as: 'criteria',
            },
      },
      {
        $lookup:
            {
              from: 'initiative_year_review_cycle_key_contributors',
              let: { cycleId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$cycle', '$$cycleId'] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: 'initiatives',
                    let: { initiativesId: '$initiative' },
                    pipeline: [
                      { $match: { $expr: { $eq: ['$_id', '$$initiativesId'] } } },
                    ],
                    as: 'initiative',
                  },
                },
                { $unwind: '$initiative' },
              ],
              as: 'contributors',
            },
      },

    ]).exec()
      .then((cycle: []) => cycle[0]);
  }

  async getEvaluationCriteria(id: string): Promise<Array> {
    return InitiativeEvaluationCriteria.findOne({ _id: id });
  }

  async getCycles(year: string): Promise<Array> {
    return InitiativeReviewCycleModel
      .find({ year })
      .populate('status');
  }

  async getUpcomingCycles(): Promise<Array> {
    const today = new Date();
    return InitiativeReviewCycleModel
      .find({ 'duration.from': { $gt: today } })
      .populate('status');
  }

  /**
   * Add Review
   * @param cycle
   * @param initiative
   * @param evaluationCriteria
   * @returns {Promise<T>}
   */
  async addReviews(cycle: string, initiative: string, evaluationCriteria: any): Promise<Array> {
    return InitiativeReviewCycleEvaluationCriteriaModel.updateOne(
      { cycle, initiative },
      {
        cycle,
        initiative,
        evaluation_criteria: evaluationCriteria,
      },
      { upsert: true },
    );
  }

  /**
   *Add Key Contributors
   * @param cycle
   * @param initiative
   * @param contributors
   * @returns {Promise<T>}
   */
  async addKeyContributors(cycle: string, initiative: string, contributors: any): Promise<Array> {
    return InitiativeYearReviewCycleReviewModel.updateOne(
      { cycle, initiative },
      {
        cycle,
        initiative,
        contributors,
      },
      { upsert: true },
    );
  }

  /**
   *Add Key Contributors
   * @param cycle
   * @returns {Promise<T>}
   */
  async publishCycle(cycle: string): Promise<Array> {
    return InitiativeReviewCycleModel.updateOne(
      { uuid: cycle },
      {
        done: true,
      },
      { upsert: true },
    );
  }
}
