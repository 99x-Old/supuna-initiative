import type { ResponseType } from 'type/response.type';

export default (response: any) => {
  const data: ResponseType = {
    body: response.data ?? {},
    message: response.data.message,
  };
  return data;
};
