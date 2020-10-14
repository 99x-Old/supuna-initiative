import EmailVerification from '../model/email_verification';

export default class EmailRepository {
  addVerification(userId: string, email: string, code: string) {
    const data = {
      user: userId,
      email,
      code,
      expiration: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const emailVerification = new EmailVerification(data);

    return emailVerification
      .save()
      .then((verification) => verification)
      .catch((err) => {
        throw err;
      });
  }

  async verifyEmail(email, code) {
    return await EmailVerification.findOne({ email, code })
      .exec()
      .then(async (data) => {
        await EmailVerification.deleteOne({ email }).exec();
        return data;
      });
  }
}
