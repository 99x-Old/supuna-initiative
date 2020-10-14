import InitiativeRepository from 'repository/initiative.repository';
import InitiativeMiddleware from 'middleware/data/initiative.middleware';
import InitiativeActionMiddleware from 'middleware/data/initiative-action.middleware';
import type { InitiativeType } from 'type/initiative.type';
import Initiative from './item/initiative';
import InitiativeYearRepository from '../repository/initiative-year.repository';
import NotificationService from './notification.service';

export default class InitiativeService {
  repository: InitiativeRepository;

  repositoryYear: InitiativeYearRepository;

  _currentUser: string;

  constructor() {
    this.repository = new InitiativeRepository();
    this.repositoryYear = new InitiativeYearRepository();
  }

  /**
   * add initiative
   * @returns {Promise<InitiativeType>}
   * @param initiative
   */
  async add(initiative: Initiative): Promise<InitiativeType> {
    await initiative.save();
    return initiative.getResults();
  }

  /**
   * get initiative year
   * @returns {Promise<InitiativeType>}
   */
  async get(id: string): Promise<InitiativeType[]> {
    const yearData = await this.repositoryYear.getCurrentYear();
    return this.repository
      .get(id, yearData._id)
      .then(InitiativeMiddleware());
  }

  /**
   * get user initiative year
   * @returns {Promise<InitiativeType>}
   */
  async getUserInitiatives(userId: string): Promise<InitiativeType[]> {
    const yearData = await this.repositoryYear.getCurrentYear();
    return this.repository
      .getUserInitiatives(userId, yearData._id);
  }

  /**
   * get initiative members
   * @returns {Promise<InitiativeType>}
   */
  async getMembers(id: string, yearId: string = null): Promise<InitiativeType[]> {
    let year = yearId;
    if (!year) {
      const yearData = await this.repositoryYear.getCurrentYear();
      year = yearData.uuid;
    }
    return this.repository
      .getMembers(id, year);
  }

  /**
   * Get initiative members
   * @returns {Promise<InitiativeType>}
   */
  async addMember(
    initiativeId: string,
    memberId: string,
    yearId: string = null,
    memberType: string = 'member',
  ): Promise<any> {
    let year = yearId;
    if (!year) {
      const yearData = await this.repositoryYear.getCurrentYear();
      year = yearData.uuid;
    }

    const notificationService = new NotificationService();
    const initiative = await this.repository.get(initiativeId);
    notificationService.sendNotification(`You have been assigned to ${initiative.name}`, memberId, this._currentUser);

    return this.repository
      .addMember(initiativeId, year, memberId, memberType);
  }

  /**
   * Remove initiative members
   * @returns {Promise<InitiativeType>}
   */
  async removeMember(
    initiativeId: string,
    memberId: string,
    yearId: string = null,
  ): Promise<any> {
    let year = yearId;
    if (!year) {
      const yearData = await this.repositoryYear.getCurrentYear();
      year = yearData.uuid;
    }

    const notificationService = new NotificationService();
    const initiative = await this.repository.get(initiativeId);
    notificationService.sendNotification(
      `You have been kicked out from ${initiative.name}`,
      memberId,
      { path: `initiative/${initiative.uuid}` },
    );

    return this.repository
      .removeMember(initiativeId, year, memberId);
  }

  /**
   * Add Objectives
   * @returns {Promise<InitiativeType>}
   */
  async addObjective(initiativeId: string, yearId: string, objective: string): Promise<any> {
    return this.repository
      .addObjective(initiativeId, yearId, objective);
  }

  /**
   * get action
   * @returns {Promise<InitiativeType>}
   */
  async getActions(id: string): Promise<InitiativeType[]> {
    const year = await this.repositoryYear.getCurrentYear();
    return this.repository
      .getActions(id, year._id.toString())
      .then((actions: any) => actions
        .map((actionItem: any) => InitiativeActionMiddleware()(actionItem)));
  }

  /**
   * get user action
   * @returns {Promise<InitiativeType>}
   */
  async getUserActions(id: string): Promise<InitiativeType[]> {
    const year = await this.repositoryYear.getCurrentYear();
    return this.repository
      .getUserActions(id, year._id.toString())
      .then((actions: any) => actions
        .map((actionItem: any) => InitiativeActionMiddleware()(actionItem)));
  }

  /**
   * delete meeting
   * @returns {Promise<InitiativeType>}
   */
  async deleteAction(id: string): Promise<InitiativeType[]> {
    const action = await this.repository.getAction(id);

    await this.repository
      .deleteAction(action._id);

    action.users.forEach((participant: any) => {
      const notificationService = new NotificationService();
      notificationService.sendNotification(
        `"${action.name}" action has been deleted!`,
        participant.user,
        this._currentUser,
        { path: `initiative/${action.initiative.uuid}/actions/?id=${action.uuid}` },
      );
    });
    return action;
  }

  /**
   * List initiative
   * @returns {Promise<InitiativeType>}
   */
  async list(currentYear: boolean): Promise<InitiativeType[]> {
    const year = currentYear ? await this.repositoryYear.getCurrentYear() : null;
    return this.repository
      .list(year?._id)
      .then((list: any) => list
        .map((listItem: any) => InitiativeMiddleware()(listItem)));
  }

  async getMeetings(
    initiativeId: string,
    userId: string,
    limit: number = 100,
    options: any = {},
  ): Promise<any[]> {
    const year = await this.repositoryYear.getCurrentYear();
    const limitNumber = +limit;

    return this.repository
      .getMeetings(initiativeId, year._id, userId, limitNumber, options);
  }

  async getMeeting(meetingId: string): Promise<any[]> {
    return this.repository
      .getMeeting(meetingId);
  }

  async startMeeting(meetingId: string): Promise<any[]> {
    await this.repository
      .startMeeting(meetingId);
    const meeting = await this.getMeeting(meetingId);
    meeting.participants.forEach((participant: any) => {
      const notificationService = new NotificationService();
      notificationService.sendNotification(
        `"${meeting.name}" meeting has been started!`,
        participant.user,
        this._currentUser,
        { path: `initiative/${meeting.initiative.uuid}/meetings/?id=${meeting.uuid}` },
      );
    });
    return meeting;
  }

  async finishMeeting(meetingId: string): Promise<any[]> {
    await this.repository
      .finishMeeting(meetingId);
    const meeting = await this.getMeeting(meetingId);
    meeting.participants.forEach((participant: any) => {
      const notificationService = new NotificationService();
      notificationService.sendNotification(
        `"${meeting.name}" meeting has been ended!`,
        participant.user,
        this._currentUser,
        { path: `initiative/${meeting.initiative.uuid}/meetings/?id=${meeting.uuid}` },
      );
    });
    return meeting;
  }

  async cancelMeeting(meetingId: string): Promise<any[]> {
    await this.repository
      .cancelMeeting(meetingId);
    const meeting = await this.getMeeting(meetingId);
    meeting.participants.forEach((participant: any) => {
      const notificationService = new NotificationService();
      notificationService.sendNotification(
        `"${meeting.name}" meeting has been canceled!`,
        participant.user,
        this._currentUser,
        { path: `initiative/${meeting.initiative.uuid}/meetings/?id=${meeting.uuid}` },
      );
    });
    return meeting;
  }

  async deleteMeeting(meetingId: string): Promise<any[]> {
    const meeting = await this.getMeeting(meetingId);
    await this.repository
      .deleteMeeting(meetingId);

    meeting.participants.forEach((participant: any) => {
      const notificationService = new NotificationService();
      notificationService.sendNotification(
        `"${meeting.name}" meeting has been deleted!`,
        participant.user,
        this._currentUser,
        { path: `initiative/${meeting.initiative.uuid}/meetings/?id=${meeting.uuid}` },
      );
    });
    return meeting;
  }

  async updateMeetingNotes(meetingId: string, notes: string): Promise<any[]> {
    return this.repository
      .updateMeetingNotes(meetingId, notes);
  }
}
