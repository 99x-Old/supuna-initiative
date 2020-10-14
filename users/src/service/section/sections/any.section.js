import type { SectionInterface } from 'service/section/section.interface';
import Base from 'service/section/base';

export default class AnySection extends Base implements SectionInterface {
  async save() {
    if (this.contents.id) {
      this.result = await this.repository.updateSection(this.contents, this.user.id);
    } else {
      this.result = await this.repository.addSection(this.contents, 'any', this.user.id);
    }
  }

  async delete() {
    this.result = await this.repository.deleteSection(this.user.id, this.id);
  }
}
