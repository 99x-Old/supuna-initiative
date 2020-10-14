export type ContentType = {
    id?: string,
    name?: string,
    title: {
        text: string,
        readonly: boolean
    },
    tags: string[] | null,
    text: string,
    position: {
        column: number,
        index: number
    }
};
