const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const LikeThreadUseCase = require('../LikeThreadUseCase');

describe('LikeThreadUseCase', () => {
  it('should orchestrating the like thread action correctly', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkIsLikedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeThread = jest.fn()
      .mockImplementation(() => {});
    mockLikeRepository.dislikeThread = jest.fn()
      .mockImplementation(() => {});

    /** creating use case instance */
    const likeThreadUseCase = new LikeThreadUseCase({
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    // Action && Assert
    await expect(likeThreadUseCase.execute('user-123', 'thread-1')).resolves.not.toThrow();
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-1');
    expect(mockLikeRepository.checkIsLikedThread).toHaveBeenCalledWith('thread-1', 'user-123');
    expect(mockLikeRepository.likeThread).toHaveBeenCalledWith('thread-1', 'user-123');
    expect(mockLikeRepository.dislikeThread).not.toHaveBeenCalled();
  });

  it('should orchestrating the dislike thread action correctly', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkIsLikedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.likeThread = jest.fn()
      .mockImplementation(() => {});
    mockLikeRepository.dislikeThread = jest.fn()
      .mockImplementation(() => {});

    /** creating use case instance */
    const likeThreadUseCase = new LikeThreadUseCase({
      threadRepository: mockThreadRepository,
      likeRepository: mockLikeRepository,
    });

    // Action && Assert
    await expect(likeThreadUseCase.execute('user-123', 'thread-1')).resolves.not.toThrow();
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-1');
    expect(mockLikeRepository.checkIsLikedThread).toHaveBeenCalledWith('thread-1', 'user-123');
    expect(mockLikeRepository.likeThread).not.toHaveBeenCalled();
    expect(mockLikeRepository.dislikeThread).toHaveBeenCalledWith('thread-1', 'user-123');
  });
});
