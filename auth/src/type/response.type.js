export type ResponseType = {
  message: string,
  body: any
};
export type ErrorResponseType = {
  message: string,
  response: { }
};
export type HeaderType = {
  'Access-Control-Allow-Origin': string,
  'Content-Type': string
};
