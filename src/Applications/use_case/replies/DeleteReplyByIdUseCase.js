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
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);
    const reply = await this._replyRepository.getReplyById(replyId);
    if (!reply.verifyOwner(userId)) {
      throw new Error('DELETE_REPLY_USECASE.NOT_AUTHORIZED');
    }
    return this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyByIdUseCase;
