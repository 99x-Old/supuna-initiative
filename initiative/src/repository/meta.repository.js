import InitiativeDepartmentModel from '../model/initiative-department.model';
import MemberTypeModel from '../model/member-type.model';
import InitiativeMemberRatingModel from '../model/initiative-member-rating.model';

export default class MetaRepository {
  /**
     * Save Initiative
     * @returns {Promise<Array>}
     * @param name
     * @param description
     */
  async addDepartment(name: string, description: string): Promise<Array> {
    const departmentModel = new InitiativeDepartmentModel({ name, description });
    return departmentModel.save();
  }

  /**
     * Save Initiative
     * @returns {Promise<Array>}
     */
  async getDepartments(): Promise<Array> {
    return InitiativeDepartmentModel.find({});
  }

  /**
     * Get member type
     * @returns {Promise<Array>}
     */
  async getMemberType(type: string): Promise<Array> {
    return MemberTypeModel.findOne({ type });
  }

  /**
     * Get top members
     * @returns {Promise<Array>}
     */
  async getTopMembers(divider: number = 5): Promise<Array> {
    return InitiativeMemberRatingModel.aggregate([
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 },
          countPro: { $sum: '$rate' },
        },
      },

      {
        $project: {
          percent: { $round: [{ $multiply: [divider, { $divide: ['$countPro', { $multiply: ['$count', 5] }] }] }, 1] },
        },
      },

      {
        $sort: { percent: -1 },
      },
      {
        $limit: 8,
      },
    ]);
  }
}
