import MetaRepository from 'repository/meta.repository';
import type { InitiativeType } from 'type/initiative.type';
import type { BaseInterface } from '../interface/base.interface';

export default class Department implements BaseInterface {
  _repository: MetaRepository;

  _name: string;

  _description: string;

  _results: string;

  constructor() {
    this._repository = new MetaRepository();
  }

  async add(): Promise<any> {
    this._results = await this._repository
      .addDepartment(this._name, this._description);
  }

  save() {}

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
}
