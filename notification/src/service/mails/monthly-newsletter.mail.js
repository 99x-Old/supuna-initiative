import { v4 as uuid } from 'uuid';
import Handlebars from 'handlebars';
import Mailer from '../mail.service';
import Queue from '../queue.service';
import RequestService from '../request';

const fs = require('fs');

const getStatus = (userId: string) => {
  const request = new RequestService();
  return request.get(`http://ennoble-x-initiative/status/${userId}`)
    .then((status: ResponseType) => status.data.data)
    .catch((response: ResponseType) => {
      // eslint-disable-next-line no-console
      console.error(response.response);
    });
};

const getUser = (userId: string) => {
  const request = new RequestService();
  return request.get(`http://ennoble-x-user/users/get/list/${userId}`)
    .then((status: ResponseType) => status.data.data)
    .catch((response: ResponseType) => {
      // eslint-disable-next-line no-console
      console.error(response.response);
    });
};

export default async (emails: string[]) => {
  const status: any = await getStatus();

  status.topUsers = await getUser(status.topUsers.map((userItem: any) => userItem._id).join(','));

  const source = fs.readFileSync(`${process.cwd()}/src/templates/emails/monthly-newsletter.template.html`, 'utf8');
  const template = Handlebars.compile(source);
  const html = template(status);

  const mail = {
    from: '"no-reply" <no-reply@ennoble-x.com>',
    to: emails.join(', '),
    subject: 'Initiative - Monthly Newsletter',
    html,
  };
  Queue(() => Mailer.send(mail), `monthly-newsletter-${uuid()}`);
};
