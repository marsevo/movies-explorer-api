const { DEFAULT_ERROR } = require('./errors');

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DEFAULT_ERROR;
  }
}

module.exports = DefaultError;
