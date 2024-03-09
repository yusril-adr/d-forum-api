class DeleteReplyByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({
    userId,
    threadId,
    commentId,
    replyId,
  }) {
    await this._threadRepository.getThreadById(threadId);
    await this._commentRepository.getCommentById(commentId);
    const reply = await this._replyRepository.getReplyById(replyId);
    reply.verifyOwner(userId);
    return this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyByIdUseCase;
