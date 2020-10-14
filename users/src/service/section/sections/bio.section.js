import type { UserType } from 'type/user.type';
import type { ContentType } from 'type/section.type';
import UserRepository from 'repository/user.repository';
import Base from 'service/section/base';
import type { SectionInterface } from '../section.interface';

export default class BioSection extends Base implements SectionInterface {
  result: UserType;

  repository: UserRepository;

  constructor() {
    super();
    this.repository = new UserRepository();
  }

  async save() {
    this.result = await this.repository.updateBio(this.user.uuid, this.contents.text);
  }

  getResult(): ContentType {
    return {
      title: {
        text: 'Bio',
        readonly: true,
      },
      tags: null,
      text: this.result.bio,
    };
  }
}
