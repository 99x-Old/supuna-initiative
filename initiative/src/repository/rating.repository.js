import InitiativeMemberRatingModel from 'model/initiative-member-rating.model';

export default class RatingRepository {
  /**
   * Add User Rating
   * @param param
   * @returns {Promise<Array>}
   */
  async rateUser(param: any): Promise<Array> {
    const data = {
      user: param.user,
      initiative: param.initiative,
      rated_by: param.ratedBy,
      rate: param.rate,
      note: param.note,
    };
    return InitiativeMemberRatingModel.updateOne(
      { user: param.user, rated_by: param.ratedBy, initiative: param.initiative },
      data,
      { upsert: true },
    );
  }

  /**
   * Get User Rating
   * @param param
   * @returns {Promise<Array>}
   */
  async getUserRating(param: any): Promise<Array> {
    return InitiativeMemberRatingModel.findOne(
      {
        user: param.user,
        initiative: param.initiative,
        rated_by: param.ratedBy,
      },
    );
  }

  /**
   * Get User Rating
   * @param param
   * @returns {Promise<Array>}
   */
  async getUserRatings(param: any): Promise<Array> {
    return InitiativeMemberRatingModel.find(
      {
        user: param.user,
        initiative: param.initiative,
      },
    );
  }
}
