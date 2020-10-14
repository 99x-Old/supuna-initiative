export default class RequestException {
    name: string;

    message: string;

    status: number;

    stack: string;

    constructor(message: string, status: number = 500, data: {} = {}) {
      this.message = message;
      this.name = this.constructor.name;
      this.status = status;
      this.data = data;
    }
}
