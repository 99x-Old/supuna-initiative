import config from 'config';
import request from './request';
import type { ResponseType } from '../types/response.type';

export default class PosterService {
  post(content: string, reference: string = null): Promise<ResponseType> {
    request.setContentType('application/json');
    return request
      .post(`${config.services.poster}/post`, { content, reference })
      .then((response: ResponseType) => response.body);
  }

  delete(postId: string): Promise<ResponseType> {
    request.setContentType('application/json');
    return request
      .delete(`${config.services.poster}/post/${postId}`)
      .then((response: ResponseType) => response.body);
  }

  deleteComment(commentId: string): Promise<ResponseType> {
    request.setContentType('application/json');
    return request
      .delete(`${config.services.poster}/comment/${commentId}`)
      .then((response: ResponseType) => response.body);
  }

  postComment(post: string, content: string): Promise<ResponseType> {
    request.setContentType('application/json');
    return request
      .post(`${config.services.poster}/comment`, { post, content })
      .then((response: ResponseType) => response.body);
  }

  getComments(post: string, lastCommentId: string): Promise<ResponseType> {
    request.setContentType('application/json');
    return request
      .get(`${config.services.poster}/comment`, { params: { post, lastCommentId } })
      .then((response: ResponseType) => response.body);
  }

  list(reference: string = null): Promise<ResponseType> {
    request.setContentType('application/json');
    return request
      .get(`${config.services.poster}/post`, { params: { reference } });
  }
}
