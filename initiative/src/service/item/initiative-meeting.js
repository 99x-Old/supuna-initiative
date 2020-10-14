import InitiativeRepository from 'repository/initiative.repository';
import { v4 as uuid4 } from 'uuid';
import type { BaseInterface } from '../interface/base.interface';
import type { InitiativeType } from '../../type/initiative.type';
import InitiativeYearRepository from '../../repository/initiative-year.repository';
import NotificationService from '../notification.service';

export default class InitiativeMeeting implements BaseInterface {
    _repository: InitiativeRepository;

    _repositoryYear: InitiativeYearRepository;

    _uuid: string;

    _currentUser: string;

    _name: string;

    _description: string;

    _date: string;

    _time: string;

    _notes: string;

    _participants: string[];

    _initiative: string;

    _results: any;

    constructor() {
      this._repository = new InitiativeRepository();
      this._repositoryYear = new InitiativeYearRepository();
      this._uuid = uuid4();
    }

    async add(): Promise<any> {
      const year = await this._repositoryYear.getCurrentYear();

      this._results = await this._repository
        .addMeeting(
          this._uuid,
          this._name,
          this._description,
          this._participants,
          this._date,
          this._time,
          this._notes,
          this._initiative,
          year._id.toString(),
          this._currentUser,
        );

      const meeting = await this._repository.getMeeting(this._uuid);
      this._participants.forEach((participant: any) => {
        const notificationService = new NotificationService();
        notificationService.sendNotification(
          `You have been assigned to "${meeting.name}" meeting!`,
          participant,
          this._currentUser,
          { path: `initiative/${meeting.initiative.uuid}/meetings/?id=${meeting.uuid}` },
        );
      });
      return meeting;
    }

    async update(): Promise<any> {
      const year = await this._repositoryYear.getCurrentYear();

      this._results = await this._repository
        .updateMeeting(
          this._uuid,
          this._name,
          this._description,
          this._participants,
          this._date,
          this._time,
          this._notes,
          this._initiative,
          year._id.toString(),
          this._currentUser,
        );
      const meeting = await this._repository.getMeeting(this._uuid);
      this._participants.forEach((participant: any) => {
        const notificationService = new NotificationService();
        notificationService.sendNotification(
          `"${meeting.name}" meeting has been updated!`,
          participant,
          this._currentUser,
          { path: `initiative/${meeting.initiative.uuid}/meetings/?id=${meeting.uuid}` },
        );
      });
    }

    delete() {
    }

    getResults(): Promise<InitiativeType> {
      return this._results;
    }

    get currentUser(): string {
      return this._currentUser;
    }

    set currentUser(value: string) {
      this._currentUser = value;
    }

    get name(): string {
      return this._name;
    }

    set name(value: string) {
      this._name = value;
    }

    get description(): string {
      return this._description;
    }

    set description(value: string) {
      this._description = value;
    }

    get date(): string {
      return this._date;
    }

    set date(value: string) {
      this._date = value;
    }

    get time(): string {
      return this._time;
    }

    set time(value: string) {
      this._time = value;
    }

    get notes(): string {
      return this._notes;
    }

    set notes(value: string) {
      this._notes = value;
    }

    get participants(): string[] {
      return this._participants;
    }

    set participants(value: Array) {
      this._participants = value;
    }

    get initiative(): string {
      return this._initiative;
    }

    set initiative(value: string) {
      this._initiative = value;
    }

    get results(): * {
      return this._results;
    }

    set results(value: *) {
      this._results = value;
    }
}
