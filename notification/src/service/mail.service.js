import config from '../../config/app';

class MailService {
  constructor() {
    const nodemailer = require('nodemailer');

    this.transport = nodemailer.createTransport({
      host: config.server._host,
      port: config.server._port,
      secure: false,
      auth: {
        user: config.server._username,
        pass: config.server._password,
      },
    });
  }

  async send(options = {}) {
    return await this.transport.sendMail(options);
  }
}

export default new MailService();
