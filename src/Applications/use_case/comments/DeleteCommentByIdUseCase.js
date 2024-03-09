class DeleteCommentByIdUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({
    userId,
    threadId,
    commentId,
  }) {
    await this._threadRepository.getThreadById(threadId);
    const comment = await this._commentRepository.getCommentById(commentId);
    comment.verifyOwner(userId);
    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentByIdUseCase;
