import Broker from './message-broker.service';
import type { UserServiceInterface } from './user.service.interface';
import EmailRepository from '../repository/email.repository';

export default class EmailService {
  repository: EmailRepository;

  userService: UserServiceInterface;

  constructor(userService: UserServiceInterface) {
    this.repository = new EmailRepository();
    this.userService = userService;
  }

  sendConfirmation(email: any, user: any) {
    this.generateVerification(email, user).then((verificationData: {}) => {
      const MessageBroker = new Broker();
      const data = {
        service: 'notification',
        action: 'send-confirm-email',
        body: {
          user,
          to: email,
          code: verificationData.code,
        },
      };

      MessageBroker.produce('notification', data).then().catch();
    });
  }

  generateVerification(email: any, user: any) {
    const code = Math.random().toString(36).slice(-10);
    return this.repository.addVerification(user._id, email, code);
  }

  async verifyEmail(email: any, code: any) {
    const dataObject = {};

    return this.repository
      .verifyEmail(email, code)
      .then((emailConfirmObject) => {
        if (emailConfirmObject) {
          return this.userService
            .setUserStatus(emailConfirmObject.user, 'active')
            .then(() => {
              dataObject.data = {};
              dataObject.status = 200;
              dataObject.headers = {};
              dataObject.message = 'Email has been verified!';
              return dataObject;
            });
        }
        dataObject.data = {};
        dataObject.status = 422;
        dataObject.headers = {};
        dataObject.message = 'Email is already verified or token is expired!';
        throw dataObject;
      });
  }
}
