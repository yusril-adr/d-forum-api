const InvariantError = require('../../Commons/exceptions/InvariantError');

class Validator {
  constructor(validator) {
    this._validator = validator;
  }

  validate(createSchema, payload) {
    const schema = createSchema(this._validator);
    const { value, error } = schema.validate(payload);

    if (error) {
      throw new InvariantError(error);
    }

    return value;
  }
}

module.exports = Validator;
