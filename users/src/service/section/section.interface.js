import type { ContentType } from 'type/section.type';

export interface SectionInterface {
    setUser(uuid: string): this,

    setContents(contents: ContentType): this,

    setSectionId(): this,

    save(): Promise<any>,

    delete(): Promise<any>,

    getResult(): ContentType
}
