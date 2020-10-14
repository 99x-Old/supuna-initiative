import bcrypt from 'bcrypt';
import Password from '../model/password';
import Error from '../error/user.error';
import Settings from '../model/settings';

class SettingRepository {
  constructor() {}

  setPassword(userId, password) {
    const passwordData = {
      password,
      user: userId,
      active: true,
    };
    const passwordModel = new Password(passwordData);
    return passwordModel.save();
  }

  setSetting(userId, name, settings) {
    const settingData = {
      name,
      user: userId,
      settings,
    };
    return Settings.updateOne({ user: userId }, settingData, { upsert: true });
  }

  async getSetting(userId, name) {
    const settingData = {
      name,
      user: userId,
    };
    return Settings.findOne(settingData).exec();
  }

  async verifyPassword(userId, password) {
    return Password.findOne({ user: userId, active: true })
      .sort({ _id: 'desc' })
      .exec()
      .then((passwordObject) => bcrypt.compare(password, passwordObject.password))
      .catch(() => {
        throw new Error('Password do not exist!');
      });
  }
}

module.exports = SettingRepository;
