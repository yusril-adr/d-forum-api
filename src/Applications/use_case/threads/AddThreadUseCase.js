class AddThreadUseCase {
  constructor({ threadRepository, validator }) {
    this._threadRepository = threadRepository;
    this._validator = validator;
  }

  schema(validator) {
    return validator.object({
      title: validator.string().required(),
      body: validator.string().required(),
    });
  }

  async execute(userId, useCasePayload) {
    const validatedPayload = this._validator.validate(this.schema, useCasePayload);
    const threadPayload = {
      ...validatedPayload,
      owner: userId,
    };
    return this._threadRepository.addThread(threadPayload);
  }
}

module.exports = AddThreadUseCase;
