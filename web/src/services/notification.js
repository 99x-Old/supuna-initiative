import config from 'config';
import request from './request';
import type { ResponseType } from '../types/response.type';
import Socket from './request/socket';
import store from '../stores';
import { setNotificationStatus, setPopup } from '../actions';

export default class Notification {
  listen(channel: string) {
    const socket = new Socket('status');
    socket
      .join(`status-${channel}`)
      .listen('status-updated', async (data: string) => {
        this.refreshNotificationsStatus();
        store.dispatch(setPopup({ message: data.body.text, type: 'info' }));
      });
  }

  refreshNotificationsStatus() {
    request.get(`${config.services.notification}/status`).then((data: ResponseType) => {
      store.dispatch(setNotificationStatus(data.body));
    });
  }
}
