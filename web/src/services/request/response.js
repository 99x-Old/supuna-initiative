import type { ResponseType } from 'types/response.type';

export default (response: any) => {
  const data: ResponseType = {
    body: response.data.data ?? {},
    message: response.data.message,
  };
  return data;
};
