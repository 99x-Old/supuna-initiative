import type { ContentType } from 'type/section.type';
import SectionRepository from 'repository/section.repository';
import type { UserMiniType } from 'type/user.type';
import sectionDataMiddleware from '../../middleware/section/section.data.middleware';

export default class Base {
  id: string;

  user: UserMiniType;

  contents: ContentType;

  repository: SectionRepository;

  result: ContentType;

  constructor() {
    this.repository = new SectionRepository();
  }

  setUser(user: UserMiniType): this {
    this.user = user;
    return this;
  }

  setSectionId(id: string): this {
    this.id = id;
    return this;
  }

  setContents(contents: ContentType): this {
    this.contents = contents;
    return this;
  }

  getResult(): ContentType {
    return sectionDataMiddleware()(this.result);
  }
}
