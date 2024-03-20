class LikeThreadUseCase {
  constructor({ threadRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userId, threadId) {
    await this._threadRepository.verifyThreadAvailability(threadId);

    const isLiked = await this._likeRepository.checkIsLikedThread(threadId, userId);

    if (isLiked) {
      await this._likeRepository.dislikeThread(threadId, userId);
    } else {
      await this._likeRepository.likeThread(threadId, userId);
    }
  }
}

module.exports = LikeThreadUseCase;
