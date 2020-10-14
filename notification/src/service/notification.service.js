import NotificationRepository from 'repository/notification.repository';

export default class NotificationService {
  repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  /**
   * Add Notification
   * @param param
   * @returns {Promise<SampleType>}
   */
  async add(param: any): Promise<any> {
    return this.repository.save(param);
  }

  async list(user: string): Promise<any> {
    return this.repository.list(user);
  }

  async status(user: string): Promise<any> {
    return this.repository.status(user);
  }
}
