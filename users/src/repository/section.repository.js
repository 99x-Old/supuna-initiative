import mongoose from 'mongoose';
import Section from '../model/section';
import type { ContentType } from '../type/section.type';
import Error from '../error/user.error';

export default class SectionRepository {
  async addSection(
    content: ContentType,
    name: string,
    userId: mongoose.Types.ObjectId,
  ): ContentType {
    const section = new Section({
      ...content,
      ...{ user: userId, name },
    });
    return section.save();
  }

  async updateSection(
    content: ContentType,
    userId: string,
  ): ContentType {
    const user = mongoose.Types.ObjectId(userId.toString());
    const id = mongoose.Types.ObjectId(content.id.toString());

    const section = await Section.findOne({ _id: id, user, name: content.name });
    if (section) {
      section.title = content.title;
      section.tags = content.tags;
      section.text = content.text;
      return section.save();
    }
    throw new Error('Invalid data!', 422);
  }

  async deleteSection(userId: string, id: string): any {
    const user = mongoose.Types.ObjectId(userId.toString());
    const sectionId = mongoose.Types.ObjectId(id.toString());

    const section = await Section.findOne({ _id: sectionId, user });
    if (section) {
      return section.delete();
    }
    throw new Error('Invalid data!', 422);
  }

  async updatePositions(userId: string, positions: []): any {
    const user = mongoose.Types.ObjectId(userId.toString());

    positions.map(async (position: any) => {
      const sectionId = mongoose.Types.ObjectId(position.id.toString());

      const section: any = await Section.findOne({ _id: sectionId, user });
      if (section) {
        section.position = position.position;
        return section.save();
      }
      throw new Error('Invalid data!', 422);
    });
  }

  getSections(user: string): any {
    return Section.find({ user });
  }
}
