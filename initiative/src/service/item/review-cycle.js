import { v4 as uuid4 } from 'uuid';
import type { BaseInterface } from '../interface/base.interface';
import InitiativeReviewRepository from '../../repository/initiative-review.repository';
import InitiativeYearRepository from '../../repository/initiative-year.repository';

export default class ReviewCycle implements BaseInterface {
    _repository: InitiativeReviewRepository;

    _repositoryYear: InitiativeYearRepository;

    _uuid: string;

    _title: string;

    _description: string;

    _duration: string;

    _results: any;

    constructor() {
      this._repository = new InitiativeReviewRepository();
      this._repositoryYear = new InitiativeYearRepository();
      this._uuid = uuid4();
    }

    async add(): Promise<any> {
      const year = await this._repositoryYear.getCurrentYear();
      this._results = await this._repository
        .add({
          uuid: this._uuid,
          title: this._title,
          year: year._id,
          duration: this._duration,
          description: this._description,
        });
    }

    getResults(): any {
      return this._results;
    }

    get title(): string {
      return this._title;
    }

    set title(value: string) {
      this._title = value;
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
}
