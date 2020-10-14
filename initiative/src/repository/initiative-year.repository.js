import mongoose from 'mongoose';
import InitiativeYearModel from '../model/initiative-year.model';
import InitiativeMemberModel from '../model/initiative-member.model';
import MetaRepository from './meta.repository';
import InitiativeRepository from './initiative.repository';
import InitiativeModel from '../model/initiative.model';
import InitiativeObjectiveModel from '../model/initiative-objective.model';
import InitiativeEvaluationCriteria from '../model/initiative-evaluation-criteria.model';

export default class InitiativeYearRepository {
  _initiativeRepository: InitiativeRepository;

  _metaRepository: MetaRepository;

  constructor() {
    this._initiativeRepository = new InitiativeRepository();
    this._metaRepository = new MetaRepository();
  }

  /**
   * Save Initiative year
   * @param param
   * @returns {Promise<Array>}
   */
  async save(param: any): Promise<Array> {
    const data = {
      uuid: param.uuid,
      name: param.name,
      description: param.description,
      duration: param.duration,
      image: param.image,
      criteria: param.criteria,
    };
    const initiativeYearModel = new InitiativeYearModel(data);
    const year = await initiativeYearModel.save();

    await param?.criteria.map(async (criteriaData: any) => {
      const criteria = {
        criteria: criteriaData.criteria,
        weight: criteriaData.weight,
        year: year._id,
        added_by: param.user,
      };
      const evaluationCriteria = new InitiativeEvaluationCriteria(criteria);
      await evaluationCriteria.save();
    });

    await param?.initiatives.map(async (initiativeData: any) => {
      const currentInitiative = await this._initiativeRepository
        .getInitiativeBasic(initiativeData.initiative);

      /**
       * Save Objectives
       */

      const objectiveData = {
        initiative: currentInitiative._id,
        year: year._id,
        objective: initiativeData.note,
      };
      const initiativeObjectiveModel = new InitiativeObjectiveModel(objectiveData);
      await initiativeObjectiveModel.save();

      /**
       * Save member details
       */
      await initiativeData.memberData?.map(async (member: any) => {
        const memberType = await this._metaRepository.getMemberType(member.memberType);

        const memberData = {
          user: member.user,
          initiative: currentInitiative._id,
          member_type: memberType._id,
          year: year._id,
          note: null,
          added_by: param.user,
        };
        const initiativeMemberModel = new InitiativeMemberModel(memberData);
        await initiativeMemberModel.save();
      });
    });

    return year;
  }

  /**
   * Save Initiative year
   * @param param
   * @returns {Promise<Array>}
   */
  async update(param: any): Promise<Array> {
    const initiativeYear = await InitiativeYearModel.findOne({ uuid: param.uuid });
    initiativeYear.name = param.name;
    initiativeYear.description = param.description;
    initiativeYear.duration = param.duration;
    initiativeYear.image = param.image;
    await initiativeYear.save();

    await InitiativeEvaluationCriteria.remove({ year: initiativeYear._id });
    await param?.criteria.map(async (criteriaData: any) => {
      const criteria = {
        criteria: criteriaData.criteria,
        weight: criteriaData.weight,
        year: initiativeYear._id,
        added_by: param.user,
      };
      const evaluationCriteria = new InitiativeEvaluationCriteria(criteria);
      await evaluationCriteria.save();
    });

    return initiativeYear;
  }

  /**
   * Get Initiative List
   * @returns {Promise<Array>}
   */
  async list(): Promise<Array> {
    return InitiativeYearModel.find({});
  }

  /**
   * Get Initiative List
   * @returns {Promise<Array>}
   */
  async getCurrentYear(): Promise<Array> {
    return InitiativeYearModel.findOne({}, {}, { sort: { created_at: -1 } });
  }

  /**
   * Get Initiative year
   * @returns {Promise<Array>}
   */
  async delete(uuid: string): Promise<Array> {
    const year = await this.get(uuid);
    await InitiativeMemberModel.deleteOne({ year: year._id });
    return InitiativeYearModel.deleteOne({ _id: year._id });
  }

  /**
   * Delete Initiative year
   * @returns {Promise<Array>}
   */
  async deleteInitiative(uuid: string, yearId: string): Promise<Array> {
    const initiative = await InitiativeModel.findOne({ uuid });
    const year = await this.get(yearId);

    await InitiativeObjectiveModel.deleteOne({ year: year._id, initiative: initiative._id });
    return InitiativeMemberModel.deleteOne({ year: year._id, initiative: initiative._id });
  }

  /**
   * Get Initiative notes
   * @returns {Promise<Array>}
   */
  async setInitiativeObjective(uuid: string, yearId: string, notes: string): Promise<Array> {
    const initiative = await InitiativeModel.findOne({ uuid });
    const year = await this.get(yearId);

    return InitiativeObjectiveModel.updateOne(
      { initiative: initiative._id, year: year._id },
      { objective: notes },
      { upsert: true },
    );
  }

  /**
   * Get Initiative year
   * @returns {Promise<Array>}
   */
  async get(uuid: string): Promise<Array> {
    return InitiativeYearModel.aggregate([
      { $match: { uuid } },
      {
        $lookup: {
          from: 'initiative_evaluation_criteria',
          localField: '_id',
          foreignField: 'year',
          as: 'evaluation_criteria',
        },
      },
      {
        $project: {
          uuid: 1,
          name: 1,
          duration: 1,
          description: 1,
          evaluation_criteria: 1,
          created_at: 1,
        },
      },
    ]).exec()
      .then(async (initiativeYears: []) => {
        const initiativeYear = initiativeYears[0];

        initiativeYear.initiatives = await InitiativeModel.aggregate([
          {
            $lookup:
                {
                  from: 'initiative_members',
                  let: { initiativeId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$initiative', '$$initiativeId'] },
                          ],
                        },
                        year: mongoose.Types.ObjectId(initiativeYear._id),
                      },
                    },
                    {
                      $lookup: {
                        from: 'member_types',
                        let: { memberTypeId: '$member_type' },
                        pipeline: [
                          { $match: { $expr: { $eq: ['$_id', '$$memberTypeId'] } } },
                        ],
                        as: 'type',
                      },
                    },
                    { $unwind: '$type' },
                  ],
                  as: 'members',
                },
          },
          {
            $lookup:
                {
                  from: 'initiative_objectives',
                  let: { initiativeId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$initiative', '$$initiativeId'] },
                          ],
                        },
                        year: mongoose.Types.ObjectId(initiativeYear._id),
                      },
                    },
                  ],
                  as: 'objectives',
                },
          },
          { $unwind: '$objectives' },
          {
            $match: {
              $or: [
                { 'members.year': mongoose.Types.ObjectId(initiativeYear._id) },
                { 'objectives.year': mongoose.Types.ObjectId(initiativeYear._id) },
              ],
            },
          },
        ]).exec();

        return initiativeYear;
      });
  }
}
