class AddCommentUseCase {
  constructor({ threadRepository, commentRepository, validator }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._validator = validator;
  }

  schema(validator) {
    return validator.object({
      content: validator.string().required(),
    });
  }

  async execute({
    userId,
    threadId,
    useCasePayload,
  }) {
    await this._threadRepository.verifyThreadAvailability(threadId);

    const validatedPayload = this._validator.validate(this.schema, useCasePayload);
    const commentPayload = {
      ...validatedPayload,
      owner: userId,
      thread: threadId,
    };
    return this._commentRepository.addComment(commentPayload);
  }
}

module.exports = AddCommentUseCase;
