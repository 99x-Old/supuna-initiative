import sanitizeHtml from 'sanitize-html';
import response from 'response/DefaultResponse';
import shouldAuth from 'middleware/router/auth.middleware';
import Mapper from 'service/section/mapper';
import type { SectionInterface } from 'service/section/section.interface';
import Base from 'service/section/base';
import SectionService from 'service/section/section.service';
import Error from 'error/user.error';
import type { ContentType } from 'type/section.type';

export default (router: any) => {
  router.use(['/users/update/*'], shouldAuth());

  router.put('update', '/section/update/:section', async (ctx: any) => {
    const sectionName = ctx.params.section;
    const data: ContentType = ctx.request.body;
    const Section = Mapper[sectionName];

    if (Section) {
      const section: SectionInterface | Base = new Section();

      data.text = sanitizeHtml(data.text, {
        allowedTags: ['b', 'strong', 'i', 'em', 'u', 'p'],
        allowedAttributes: {},
        exclusiveFilter: (frame: any) => !frame.text.trim(),
        textFilter: (tagText: string) => tagText.trim(),
      });
      data.title.text = sanitizeHtml(data.title.text, {
        allowedTags: [],
        allowedAttributes: {},
        exclusiveFilter: (frame: any) => !frame.text.trim(),
        textFilter: (tagText: string) => tagText.trim(),
      });

      section.setContents(data);
      section.setUser(ctx.state.user);
      await section.save();
      section.getResult();

      const savedContent: ContentType = section.getResult();

      ctx.body = response.response(savedContent);
    } else {
      throw new Error('Invalid Section!', 500);
    }
  });

  router.delete('delete', '/section/delete/:sectionId/:sectionName', async (ctx: any) => {
    const { sectionId } = ctx.params;
    const { sectionName } = ctx.params;

    const Section = Mapper[sectionName];

    if (Section) {
      const section: SectionInterface | Base = new Section();

      section.setSectionId(sectionId);
      section.setUser(ctx.state.user);
      await section.delete();
      section.getResult();

      const savedContent: ContentType = section.getResult();

      ctx.body = response.response(savedContent);
    } else {
      throw new Error('Invalid Section!', 500);
    }
  });

  router.put('delete', '/section/positions', async (ctx: any) => {
    const sectionService: SectionService = new SectionService();
    const positions: any = ctx.request.body;
    const { user } = ctx.state;
    ctx.body = response.response(sectionService.updatePositions(user, positions));
  });

  return router;
};
