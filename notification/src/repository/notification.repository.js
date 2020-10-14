import NotificationModel from 'model/notification.model';
import type { SampleType } from 'type/sample.type';

export default class NotificationRepository {
  /**
   * Save Notification
   * @param param
   * @returns {Promise<Array>}
   */
  async save(param: SampleType | any): Promise<Array> {
    const data = {
      uuid: param.uuid,
      text: param.text,
      to_user: param.to_user,
      from_user: param.from_user,
      options: param.options,
    };
    const notification = new NotificationModel(data);
    return notification.save();
  }

  async list(user: string): Promise<Array> {
    await NotificationModel
      .update({ to_user: user }, { $set: { red: true } }, { multi: true });

    return NotificationModel
      .find({ to_user: user })
      .sort({ created_at: -1 })
      .limit(20);
  }

  async status(user: string): Promise<Array> {
    const data = {};
    data.unread = await NotificationModel.countDocuments({ to_user: user, red: false });
    return data;
  }
}
