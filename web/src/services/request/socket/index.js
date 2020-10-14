import io from 'socket.io-client';
import store from 'stores';
import config from 'config';
import type { DataInterface } from './data.interface';

export default class Socket {
  client;

  channel;

  listeners: [] = [];

  constructor(namespace: string) {
    this.client = io.connect(`${config.services.socket}/${namespace}`, {
      path: '/socket/socket.io',
      transportOptions: {
        polling: {
          extraHeaders: this.getHeaders(),
        },
      },
    });
    // eslint-disable-next-line no-console
    console.log(`Socket initialized: ${namespace}`);
  }

  getHeaders(): any {
    const { auth }: any = store.getState();
    this.auth = auth;
    const headers: any = {
    };

    if (auth?.access_token) {
      headers.Authorization = `Bearer ${auth.access_token}`;
    }

    return headers;
  }

  join(channel: string): this {
    this.client.emit('join', channel);
    this.channel = channel;
    // eslint-disable-next-line no-console
    console.log('Joined:', channel);
    return this;
  }

  send(data: DataInterface): this {
    this.client.emit('send', data);
    return this;
  }

  listen(event: string, callback: function): this {
    // eslint-disable-next-line no-console
    console.log('Start Listing to:', event);
    this.client.on(event, callback);
    this.listeners.push(event);
    return this;
  }

  disconnect(listeners: [] = []): this {
    if (this.listeners.length) {
      this.listeners.map((listener: string) => {
        if (listeners.includes(listener)) {
          // eslint-disable-next-line no-console
          console.log(`%cDisconnected: ${this.channel}:${listener} `, 'color: #bada55');
          this.client.removeAllListeners(listener);
        }
        return true;
      });
      this.listeners = [];
    }
    return this;
  }
}
