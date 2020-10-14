import InitiativeRepository from 'repository/initiative.repository';
import RatingRepository from '../repository/rating.repository';
import InitiativeYearRepository from '../repository/initiative-year.repository';

export default class RatingService {
  repository: RatingRepository;

  initiativeRepository: InitiativeRepository;

  initiativeYearRepository: InitiativeYearRepository;

  _currentUser: string;

  constructor() {
    this.repository = new RatingRepository();
    this.initiativeRepository = new InitiativeRepository();
    this.initiativeYearRepository = new InitiativeYearRepository();
  }

  async rateUser(user: string, initiativeId: string, rate: number, note: string = ''): any {
    const year = await this.initiativeYearRepository.getCurrentYear();
    const initiative = await this.initiativeRepository.get(initiativeId, year._id);

    return this.repository.rateUser({
      user,
      initiative: initiative._id,
      ratedBy: this._currentUser,
      rate,
      note,
    });
  }

  async getUserRatings(user: string, initiativeId: string): any {
    const year = await this.initiativeYearRepository.getCurrentYear();
    const initiative = await this.initiativeRepository.get(initiativeId, year._id);

    const data = {};

    data.currentUserRating = await this.repository.getUserRating({
      user,
      initiative: initiative._id,
      ratedBy: this._currentUser,
    });
    data.reviews = await this.repository.getUserRatings({
      user,
      initiative: initiative._id,
    });

    data.overallRatings = data.reviews
        ?.reduce((n: number, { rate }: any) => n + rate, 0) / data.reviews.length;

    const group = data.reviews.reduce((a: any, b: any) => {
      // eslint-disable-next-line no-param-reassign
      (a[b.rate] = a[b.rate] || []).push(b);
      return a;
    }, {});

    const groupCount = {};
    const counts = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    counts.forEach((key: string) => {
      groupCount[key] = group[key]?.length ?? 0;
    });
    data.group = groupCount;

    return data;
  }
}
