import axios from 'axios';
import type { HeaderType, ResponseType } from 'type/response.type';
import Response from './response';

class Request {
    contentType: string;

    headers: [];

    setDefault() {
      const service = axios.create({
        headers: this.getHeaders(),
      });
      service.interceptors.response.use(Response);
      this.service = service;
      this.contentType = 'application/x-www-form-urlencoded;charset=utf-8';
    }

    setHeaders(headers: []): Request {
      this.headers = headers;
      return this;
    }

    setContentType(contentType: string): Request {
      this.contentType = contentType;
      return this;
    }

    getHeaders(): HeaderType {
      return {
        ...{
          'Access-Control-Allow-Origin': '*',
          'Content-Type': this.contentType,
        },
        ...this.headers,
      };
    }

    get(path: string, param: any): Promise<ResponseType> {
      this.setDefault();
      return this.service.get(path, param);
    }

    post(path: string, payload: any): Promise<ResponseType> {
      this.setDefault();
      return this.service.request({
        method: 'POST',
        url: path,
        responseType: 'json',
        data: payload,
      });
    }

    put(path: string, payload: any): Promise<ResponseType> {
      this.setDefault();
      return this.service.request({
        method: 'PUT',
        url: path,
        responseType: 'json',
        data: payload,
      });
    }

    delete(path: string, payload: any): Promise<ResponseType> {
      this.setDefault();
      return this.service.request({
        method: 'DELETE',
        url: path,
        responseType: 'json',
        data: payload,
      });
    }
}

export default new Request();
