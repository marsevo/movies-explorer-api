const { VALIDATION_ERROR } = require('./errors');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = VALIDATION_ERROR;
  }
}

module.exports = ValidationError;
