import InitiativeRepository from 'repository/initiative.repository';
import { v4 as uuid4 } from 'uuid';
import type { BaseInterface } from '../interface/base.interface';
import type { InitiativeType } from '../../type/initiative.type';

export default class Initiative implements BaseInterface {
  _repository: InitiativeRepository;

  _uuid: string;

  _name: string;

  _description: string;

  _department: string;

  _image: string;

  _results: any;

  constructor() {
    this._repository = new InitiativeRepository();
    this._uuid = uuid4();
  }

  add() {}

  async save() {
    await this._repository.save({
      uuid: this._uuid,
      name: this._name,
      description: this._description,
      department: this._department,
    });
  }

  delete() {}

  getResults(): Promise<InitiativeType> {
    return this._results;
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

  get department(): string {
    return this._department;
  }

  set department(value: string) {
    this._department = value;
  }

  get image(): string {
    return this._image;
  }

  set image(value: string) {
    this._image = value;
  }
}
