class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute({
    userId,
    threadId,
    commentId,
  }) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);

    const isLiked = await this._likeRepository.checkIsLikedComment(commentId, userId);

    if (isLiked) {
      await this._likeRepository.dislikeComment(commentId, userId);
    } else {
      await this._likeRepository.likeComment(commentId, userId);
    }
  }
}

module.exports = LikeCommentUseCase;
