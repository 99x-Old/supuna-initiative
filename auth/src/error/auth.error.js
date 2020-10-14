export default class AuthError extends Error {
  constructor(message, status, data = {}) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;
    this.data = data;
  }
}
