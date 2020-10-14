import * as schedule from 'node-schedule';
import type { SchedulerInterface } from './scheduler.interface';
import sendMonthlyNewsletter from '../../mails/monthly-newsletter.mail';
import RequestService from '../../request';

export default class MonthlyNewsletterScheduler implements SchedulerInterface {
  _crone;

  constructor() {
    this._crone = '0 8 1 * *';
  }

  getUser(): Promise<any> {
    const request = new RequestService();
    return request.get('http://ennoble-x-user/users')
      .then((status: ResponseType) => status.data.data)
      .catch((response: ResponseType) => {
        // eslint-disable-next-line no-console
        console.error(response.response);
      });
  }

  async proceed() {
    const users = await this.getUser();

    const emails = users.list.map((user: any) => user.email);

    await sendMonthlyNewsletter(emails);
    schedule.scheduleJob(this._crone, () => {
      sendMonthlyNewsletter(emails);
    });
  }
}
