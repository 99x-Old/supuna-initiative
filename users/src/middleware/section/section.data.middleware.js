import type { ContentType } from 'type/section.type';

const sectionDataMiddleware = () => (sectionData: ContentType): ContentType => ({
  id: sectionData.id,
  name: sectionData.name,
  title: {
    text: sectionData.title.text,
    readonly: sectionData.title.readonly,
  },
  tags: sectionData.tags,
  text: sectionData.text,
  position: {
    column: sectionData.position.column,
    index: sectionData.position.index,
  },
});

export default sectionDataMiddleware;
