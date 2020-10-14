import axios from 'axios';

export default class RequestService {
  post(url: string, data: any, headers: any = {
    'content-type': 'application/json',
  }): any {
    return axios({
      method: 'post',
      url,
      params: data,
      headers,
    });
  }

  get(url: string, data: any, headers: any): Promise<ResponseType> {
    return axios({
      method: 'get',
      url,
      params: data,
      headers,
    });
  }
}
