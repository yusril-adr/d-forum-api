class AddReplyUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, validator,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
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
    commentId,
    useCasePayload,
  }) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);

    const validatedPayload = this._validator.validate(this.schema, useCasePayload);
    const replyPayload = {
      ...validatedPayload,
      owner: userId,
      parent: commentId,
    };
    return this._replyRepository.addReply(replyPayload);
  }
}

module.exports = AddReplyUseCase;
