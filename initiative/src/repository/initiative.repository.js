import InitiativeModel from 'model/initiative.model';
import type { InitiativeType } from 'type/initiative.type';
import mongoose from 'mongoose';
import InitiativeMemberModel from 'model/initiative-member.model';
import InitiativeActionModel from 'model/initiative-action.model';
import InitiativeError from 'error/initiative.error';
import MemberTypeModel from '../model/member-type.model';
import InitiativeYearModel from '../model/initiative-year.model';
import InitiativeObjectiveModel from '../model/initiative-objective.model';
import InitiativeMeetingModel from '../model/initiative-meeting.model';

export default class InitiativeRepository {
  /**
     * Save Initiative
     * @param param
     * @returns {Promise<Array>}
     */
  async save(param: InitiativeType | any): Promise<Array> {
    const data = {
      uuid: param.uuid,
      name: param.name,
      description: param.description,
      department: param.department,
    };
    const initiative = new InitiativeModel(data);
    return initiative.save();
  }

  /**
     * Get Initiative List
     * @returns {Promise<Array>}
     */
  async list(year: string): Promise<Array> {
    let yearMatch = [];

    if (year) {
      yearMatch = [
        {
          $lookup: {
            from: 'initiative_objectives',
            localField: '_id',
            foreignField: 'initiative',
            as: 'objectives',
          },
        },
        { $match: { 'objectives.year': year } }];
    }
    return InitiativeModel.aggregate([
      {
        $sort: { created_at: -1 },
      },
      ...yearMatch,
    ]);
  }

  /**
     * Get Initiative
     * @returns {Promise<Array>}
     */
  async getInitiativeBasic(id: string): Promise<Array> {
    return InitiativeModel.findOne({ uuid: id });
  }

  /**
     * Get Initiative
     * @returns {Promise<Array>}
     */
  async get(id: string, year: string): Promise<Array> {
    return InitiativeModel.aggregate([
      { $match: { uuid: id } },
      {
        $lookup: {
          from: 'initiative_objectives',
          localField: '_id',
          foreignField: 'initiative',
          as: 'objectives',
        },
      },
      {
        $lookup: {
          from: 'initiative_members',
          let: { initiativeId: '$_id', yearId: year },
          pipeline: [
            { $match: { $expr: { $eq: ['$initiative', '$$initiativeId'] } } },
            { $match: { $expr: { $eq: ['$year', '$$yearId'] } } },
          ],
          as: 'members',
        },
      },
      {
        $addFields: {
          objectives: { $slice: ['$objectives.objective', -1] },
        },
      },
      { $unwind: '$objectives' },

    ]).exec()
      .then((initiative: []) => initiative[0]);
  }

  /**
     * Get User Initiative
     * @returns {Promise<Array>}
     */
  async getUserInitiatives(id: string, year: string): Promise<Array> {
    return InitiativeModel.aggregate([
      {
        $lookup: {
          from: 'initiative_members',
          let: { initiativeId: '$_id', yearId: year, userId: id },
          pipeline: [
            { $match: { $expr: { $eq: ['$initiative', '$$initiativeId'] } } },
            { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
            { $match: { $expr: { $eq: ['$year', '$$yearId'] } } },
          ],
          as: 'members',
        },
      },
      { $unwind: '$members' },
      { $match: { 'members.user': id } },
      { $match: { 'members.year': year } },
    ]);
  }

  /**
     * Add action
     * @param uuid
     * @param name
     * @param description
     * @param userIds
     * @param initiative
     * @param deadline
     * @param subActions
     * @param year
     * @param addedBy
     * @returns {Promise<T>}
     */
  async addActions(
    uuid: string,
    name: string,
    description: string,
    userIds: [],
    initiative: string,
    deadline: string,
    subActions: any,
    year: string,
    addedBy: string,
  ): Promise<Array> {
    const initiativeData = await InitiativeModel.findOne({ uuid: initiative });

    const users = await Promise.all(userIds.map(async (user: string) => {
      const memberData = await InitiativeMemberModel
        .findOne({ user, initiative: initiativeData._id })
        .exec();

      if (!memberData) {
        throw new InitiativeError('You must select a user in the current Initiative!');
      }
      return memberData._id;
    }));

    const data = {
      uuid,
      name,
      description,
      users,
      initiative: initiativeData._id,
      deadline,
      sub_actions: subActions,
      year: mongoose.Types.ObjectId(year),
      added_by: addedBy,
    };

    const initiativeActionModel = new InitiativeActionModel(data);
    return initiativeActionModel.save();
  }

  /**
     * Add action
     * @param uuid
     * @param name
     * @param description
     * @param participants
     * @param date
     * @param time
     * @param notes
     * @param initiative
     * @param year
     * @param addedBy
     * @returns {Promise<T>}
     */
  async addMeeting(
    uuid: string,
    name: string,
    description: string,
    participants: [],
    date: string,
    time: string,
    notes: string,
    initiative: string,
    year: string,
    addedBy: string,
  ): Promise<Array> {
    const initiativeData = await InitiativeModel.findOne({ uuid: initiative });

    const users = await Promise.all(participants.map(async (user: string) => {
      const memberData = await InitiativeMemberModel
        .findOne({ user, initiative: initiativeData._id, year })
        .exec();

      if (!memberData) {
        throw new InitiativeError('You must select a user in the current Initiative!');
      }
      return memberData._id;
    }));

    const data = {
      uuid,
      name,
      description,
      participants: users,
      date,
      time,
      notes,
      initiative: initiativeData._id,
      year,
      added_by: addedBy,
    };

    const initiativeMeetingModel = new InitiativeMeetingModel(data);
    return initiativeMeetingModel.save();
  }

  /**
     * Add action
     * @param uuid
     * @param name
     * @param description
     * @param participants
     * @param date
     * @param time
     * @param notes
     * @param initiative
     * @param year
     * @param addedBy
     * @returns {Promise<T>}
     */
  async updateMeeting(
    uuid: string,
    name: string,
    description: string,
    participants: [],
    date: string,
    time: string,
    notes: string,
    initiative: string,
    year: string,
    addedBy: string,
  ): Promise<Array> {
    const initiativeData = await InitiativeModel.findOne({ uuid: initiative });

    const users = await Promise.all(participants.map(async (user: string) => {
      const memberData = await InitiativeMemberModel
        .findOne({ user, initiative: initiativeData._id })
        .exec();

      if (!memberData) {
        throw new InitiativeError('You must select a user in the current Initiative!');
      }
      return memberData._id;
    }));

    const data = {
      uuid,
      name,
      description,
      participants: users,
      date,
      time,
      notes,
      initiative,
      year,
      addedBy,
    };

    const initiativeMeetingModel = new InitiativeMeetingModel(data);
    return initiativeMeetingModel.save();
  }

  async updateActions(
    uuid: string,
    name: string,
    description: string,
    userIds: [],
    initiative: string,
    deadline: string,
    subActions: any,
    year: string,
    addedBy: string,
    done: boolean,
  ): Promise<Array> {
    const initiativeData = await InitiativeModel.findOne({ uuid: initiative });

    const users = await Promise.all(userIds.map(async (user: string) => {
      const memberData = await InitiativeMemberModel
        .findOne({ user, initiative: initiativeData._id })
        .exec();

      if (!memberData) {
        throw new InitiativeError('You must select a user in the current Initiative!');
      }
      return memberData._id;
    }));

    /**
         *  Done Action
         */
    let actonChanged = subActions;
    if (done) {
      actonChanged = actonChanged
        .map((subActionItem: any) => ({ ...subActionItem, ...{ done: true } }));
    }

    const data = {
      uuid,
      name,
      description,
      users,
      initiative: initiativeData._id,
      deadline,
      sub_actions: actonChanged,
      year: mongoose.Types.ObjectId(year),
      added_by: addedBy,
      done,
    };
    return InitiativeActionModel.updateOne(
      { uuid },
      data,
      { upsert: true },
    );
  }

  async getMeetings(initiativeId: string,
    year: string,
    userId: string,
    limit: number = 100,
    options: any = {}): Promise<Array> {
    let initiativeMatch = {};
    if (initiativeId) {
      const initiative = await InitiativeModel.findOne({ uuid: initiativeId });
      initiativeMatch = { initiative: initiative._id };
    }
    const userMatch = userId ? { 'participants.user': userId } : {};
    const upcomingMatch = options.upComing ? {
      date: {
        $gte: new Date(),
      },
    } : {};

    return InitiativeMeetingModel.aggregate(
      [
        {
          $match: {
            ...initiativeMatch,
            year,
          },
        },
        {
          $lookup: {
            from: 'initiative_members',
            localField: 'participants',
            foreignField: '_id',
            as: 'participants',
          },

        },
        { $match: { ...upcomingMatch } },
        { $match: { ...userMatch } },
        { $sort: { date: 1 } },
        {
          $limit: limit,
        },
      ],
    );
  }

  async getMeeting(meetingId: string): Promise<Array> {
    return InitiativeMeetingModel.findOne({ uuid: meetingId })
      .populate('participants')
      .populate('initiative');
  }

  async getAction(id: string): Promise<Array> {
    return InitiativeActionModel
      .findOne({ uuid: id })
      .populate('users');
  }

  async deleteAction(id: string): Promise<Array> {
    return InitiativeActionModel.findOneAndDelete(
      { _id: id },
    );
  }

  // eslint-disable-next-line no-unused-vars
  async getActions(id: string, year: string): Promise<Array> {
    const initiative = await InitiativeModel.findOne({ uuid: id });
    return InitiativeActionModel
      .aggregate(
        [
          { $match: { initiative: initiative._id } },
          { $match: { year: mongoose.Types.ObjectId(year) } },
          {
            $lookup: {
              from: 'initiative_members',
              localField: 'users',
              foreignField: '_id',
              as: 'users',
            },
          },
          {
            $project: {
              name: 1,
              initiative: 1,
              year: 1,
              added_by: 1,
              created_at: 1,
              uuid: 1,
              description: 1,
              deadline: 1,
              sub_actions: 1,
              done: 1,
              users: '$users.user',
            },
          },
          { $sort: { created_at: -1 } },
        ],
      );
  }

  // eslint-disable-next-line no-unused-vars
  async getUserActions(id: string, year: string): Promise<Array> {
    return InitiativeActionModel
      .aggregate(
        [
          { $match: { year: mongoose.Types.ObjectId(year) } },
          {
            $lookup: {
              from: 'initiative_members',
              localField: 'users',
              foreignField: '_id',
              as: 'users',
            },
          },
          {
            $lookup: {
              from: 'initiatives',
              localField: 'initiative',
              foreignField: '_id',
              as: 'initiative',
            },
          },
          { $unwind: '$initiative' },
          {
            $project: {
              name: 1,
              year: 1,
              added_by: 1,
              created_at: 1,
              uuid: 1,
              description: 1,
              deadline: 1,
              sub_actions: 1,
              done: 1,
              users: '$users.user',
              initiative: '$initiative.uuid',
            },
          },
          { $match: { users: id } },
          { $sort: { created_at: -1 } },
        ],
      );
  }

  async getMembers(id: string, yearId: string): Promise<Array> {
    const initiative = await this.get(id);
    if (!initiative) {
      return null;
    }
    const yearData = await InitiativeYearModel.findOne({ uuid: yearId });

    return InitiativeMemberModel
      .aggregate(
        [
          { $match: { initiative: initiative._id } },
          { $match: { year: yearData._id } },
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
          {
            $group: {
              _id: '$year._id',
              name: { $first: '$year.name' },
              createdAt: { $first: '$year.created_at' },
              duration: { $first: '$year.duration' },
              users: {
                $push: {
                  userId: '$user',
                  note: '$note',
                  memberType: '$type.type',
                  year: '$year._id',
                  added_by: '$added_by',
                },
              },
            },
          },
        ],
      );
  }

  async getMember(uuid: string, id: string, yearId: string): Promise<Array> {
    const initiative = await this.get(id);
    if (!initiative) {
      return null;
    }
    const yearData = await InitiativeYearModel.findOne({ uuid: yearId });

    return InitiativeMemberModel
      .aggregate(
        [
          { $match: { initiative: initiative._id } },
          { $match: { year: yearData._id } },
          { $match: { user: uuid } },
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
      ).exec()
      .then((member: []) => member[0]);
  }

  /**
     * Add Member
     * @param initiativeId
     * @param yearId
     * @param memberId
     * @param memberType
     * @returns {Promise<T>}
     */
  async addMember(
    initiativeId: string,
    yearId: string,
    memberId: string,
    memberType: string,
  ): Promise<Array> {
    const initiativeData = await this.get(initiativeId);
    const memberTypeData = await MemberTypeModel.findOne({ type: memberType });
    const yearData = await InitiativeYearModel.findOne({ uuid: yearId });

    const memberData = {
      user: memberId,
      initiative: initiativeData._id,
      member_type: memberTypeData._id,
      year: yearData._id,
      note: null,
    };
    return InitiativeMemberModel.findOneAndUpdate(
      { user: memberId, initiative: initiativeData._id, year: yearData._id }, memberData,
      { upsert: true },
    );
  }

  /**
     * Remove Member
     * @param initiativeId
     * @param yearId
     * @param memberId
     * @returns {Promise<T>}
     */
  async removeMember(
    initiativeId: string,
    yearId: string,
    memberId: string,
  ): Promise<Array> {
    const initiativeData = await this.get(initiativeId);
    const yearData = await InitiativeYearModel.findOne({ uuid: yearId });

    return InitiativeMemberModel.findOneAndDelete(
      { user: memberId, initiative: initiativeData._id, year: yearData._id },
    );
  }

  /**
     * Add Objectives
     * @param initiativeId
     * @param yearId
     * @param objective
     * @returns {Promise<*>}
     */
  async addObjective(initiativeId: string, yearId: string, objective: string): Promise<Array> {
    const initiativeData = await InitiativeModel.findOne({ uuid: initiativeId });
    const yearData = await InitiativeYearModel.findOne({ uuid: yearId });

    const data = {
      initiative: initiativeData._id,
      year: yearData._id,
      objective,
    };

    const initiativeObjectiveModel = new InitiativeObjectiveModel(data);
    return initiativeObjectiveModel.save();
  }

  /**
     * Change meeting status
     * @param meetingId
     * @returns {Promise<*>}
     */
  async startMeeting(meetingId: string): Promise<Array> {
    const meeting = await InitiativeMeetingModel.findOne({ uuid: meetingId });
    meeting.status = 'ongoing';
    meeting.started_at = new Date();
    return meeting.save();
  }

  /**
     * Change meeting status
     * @param meetingId
     * @returns {Promise<*>}
     */
  async finishMeeting(meetingId: string): Promise<Array> {
    const meeting = await InitiativeMeetingModel.findOne({ uuid: meetingId });
    meeting.status = 'finished';
    meeting.finished_at = new Date();
    return meeting.save();
  }

  /**
     * Change meeting status
     * @param meetingId
     * @returns {Promise<*>}
     */
  async cancelMeeting(meetingId: string): Promise<Array> {
    const meeting = await InitiativeMeetingModel.findOne({ uuid: meetingId });
    meeting.status = 'canceled';
    meeting.finished_at = new Date();
    return meeting.save();
  }

  /**
     * delete meeting
     * @param meetingId
     * @returns {Promise<*>}
     */
  async deleteMeeting(meetingId: string): Promise<Array> {
    const meeting = await InitiativeMeetingModel.findOne({ uuid: meetingId });
    return meeting.delete();
  }

  /**
     * delete meeting
     * @param meetingId
     * @param notes
     * @returns {Promise<*>}
     */
  async updateMeetingNotes(meetingId: string, notes: string): Promise<Array> {
    const meeting = await InitiativeMeetingModel.findOne({ uuid: meetingId });
    meeting.notes = notes;
    return meeting.save();
  }
}
