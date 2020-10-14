import InitiativeYearRepository from 'repository/initiative-year.repository';
import { v4 as uuid4 } from 'uuid';
import type { BaseInterface } from '../interface/base.interface';
import type { InitiativeType } from '../../type/initiative.type';

export default class InitiativeYear implements BaseInterface {
  _repository: InitiativeYearRepository;

  _currentUser: string;

  _uuid: string;

  _name: string;

  _description: string;

  _duration: string;

  _criteria: [
    {
      criteria: string,
      weight: number
    }
  ];

  _image: string;

  _initiatives: {
    memberData: [{
        memberType: string,
        user: string
      }],
    note: string,
    initiative: string
  };

  _results: any;

  constructor() {
    this._repository = new InitiativeYearRepository();
    this._uuid = uuid4();
  }

  async add() {
    this._results = await this._repository.save({
      user: this._currentUser,
      uuid: this._uuid,
      name: this._name,
      description: this._description,
      duration: this._duration,
      image: this._image,
      initiatives: this._initiatives,
      criteria: this._criteria,
    });
  }

  async update() {
    this._results = await this._repository.update({
      user: this._currentUser,
      uuid: this._uuid,
      name: this._name,
      description: this._description,
      duration: this._duration,
      image: this._image,
      initiatives: this._initiatives,
      criteria: this._criteria,
    });
  }

  delete() {}

  getResults(): Promise<InitiativeType> {
    return this._results;
  }

  get criteria(): any {
    return this._criteria;
  }

  set criteria(value: any) {
    this._criteria = value;
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

  get duration(): string {
    return this._duration;
  }

  set duration(value: string) {
    this._duration = value;
  }

  get initiatives(): any {
    return this._initiatives;
  }

  set initiatives(value: any) {
    this._initiatives = value;
  }

  get image(): string {
    return this._image;
  }

  set image(value: string) {
    this._image = value;
  }

  get currentUser(): string {
    return this._currentUser;
  }

  set currentUser(value: string) {
    this._currentUser = value;
  }

  get uuid(): string {
    return this._uuid;
  }

  set uuid(value: string) {
    this._uuid = value;
  }
}
