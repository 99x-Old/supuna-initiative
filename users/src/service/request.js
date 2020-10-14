import axios from 'axios';

export default class RequestService {
  constructor() {}

  post(
    url: string,
    data: [],
    headers: any = {
      'content-type': 'application/json',
    },
  ) {
    return axios({
      method: 'post',
      url,
      params: data,
      headers,
    });
  }
}
