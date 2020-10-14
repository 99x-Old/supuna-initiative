import InitiativeRepository from 'repository/initiative.repository';
import { v4 as uuid4 } from 'uuid';
import type { BaseInterface } from '../interface/base.interface';
import type { InitiativeType } from '../../type/initiative.type';
import InitiativeYearRepository from '../../repository/initiative-year.repository';
import NotificationService from '../notification.service';

export default class InitiativeAction implements BaseInterface {
    _repository: InitiativeRepository;

    _repositoryYear: InitiativeYearRepository;

    _uuid: string;

    _currentUser: string;

    _done: boolean;

    get done(): boolean {
      return this._done;
    }

    set done(value: boolean) {
      this._done = value;
    }

    _results: any;

    constructor() {
      this._repository = new InitiativeRepository();
      this._repositoryYear = new InitiativeYearRepository();
      this._uuid = uuid4();
    }

    _subActions: [{
        value: string,
        done: boolean
    }];

    get uuid(): string {
      return this._uuid;
    }

    set uuid(value: string) {
      this._uuid = value;
    }

    get subActions(): [{ value: string, done: boolean }] {
      return this._subActions;
    }

    set subActions(value: [{ value: string, done: boolean }]) {
      this._subActions = value;
    }

    _name: string;

    get name(): string {
      return this._name;
    }

    set name(value: string) {
      this._name = value;
    }

    _description: string;

    get description(): string {
      return this._description;
    }

    set description(value: string) {
      this._description = value;
    }

    _users: string[];

    get users(): string[] {
      return this._users;
    }

    set users(value: Array) {
      this._users = value;
    }

    _initiative: string;

    get initiative(): string {
      return this._initiative;
    }

    set initiative(value: string) {
      this._initiative = value;
    }

    _year: string;

    get year(): string {
      return this._year;
    }

    set year(value: string) {
      this._year = value;
    }

    _deadline: string;

    get deadline(): string {
      return this._deadline;
    }

    set deadline(value: string) {
      this._deadline = value;
    }

    _addedBy: string;

    get addedBy(): string {
      return this._addedBy;
    }

    set addedBy(value: string) {
      this._addedBy = value;
    }

    async add(): Promise<any> {
      const year = await this._repositoryYear.getCurrentYear();

      this._results = await this._repository
        .addActions(
          this._uuid,
          this._name,
          this._description,
          this._users,
          this._initiative,
          this._deadline,
          this._subActions,
          year._id.toString(),
          this._currentUser,
        );

      this._users.forEach((userId: string) => {
        const notificationService = new NotificationService();
        notificationService.sendNotification(`You have been assigned to an action ${this._name} `, userId, this._currentUser, this._results);
      });
    }

    async update(): Promise<any> {
      const year = await this._repositoryYear.getCurrentYear();

      this._results = await this._repository
        .updateActions(
          this._uuid,
          this._name,
          this._description,
          this._users,
          this._initiative,
          this._deadline,
          this._subActions,
          year._id.toString(),
          this._currentUser,
          this._done,
        );

      this._users.forEach((userId: string) => {
        const notificationService = new NotificationService();
        notificationService.sendNotification(
          `The action ${this._name} has been updated!`,
          userId, this._currentUser,
          { path: `initiative/${this._initiative}/actions/?id=${this._uuid}` },
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
}
