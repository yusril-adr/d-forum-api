const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like thread action correctly', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkIsLikedComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => {});
    mockLikeRepository.dislikeComment = jest.fn()
      .mockImplementation(() => {});

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action && Assert
    await expect(likeCommentUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-1',
      commentId: 'comment-123',
    })).resolves.not.toThrow();
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-1');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.checkIsLikedComment).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.likeComment).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.dislikeComment).not.toHaveBeenCalled();
  });

  it('should orchestrating the dislike thread action correctly', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.checkIsLikedComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => {});
    mockLikeRepository.dislikeComment = jest.fn()
      .mockImplementation(() => {});

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action && Assert
    await expect(likeCommentUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-1',
      commentId: 'comment-123',
    })).resolves.not.toThrow();
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-1');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockLikeRepository.checkIsLikedComment).toHaveBeenCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.likeComment).not.toHaveBeenCalled();
    expect(mockLikeRepository.dislikeComment).toHaveBeenCalledWith('comment-123', 'user-123');
  });
});
