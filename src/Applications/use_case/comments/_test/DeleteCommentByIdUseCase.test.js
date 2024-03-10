const Comment = require('../../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentByIdUseCase = require('../DeleteCommentByIdUseCase');

describe('DeleteCommentByIdUseCase', () => {
  it('should throw error when thread is not found', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentByIdUseCase = new DeleteCommentByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentByIdUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    })).rejects.toThrow(Error);
  });

  it('should throw error when comment is not found', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentByIdUseCase = new DeleteCommentByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentByIdUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    })).rejects.toThrow(Error);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
  });

  it('should throw error when user id is not the owner', async () => {
    // Arrange
    const expectedDate = new Date();
    const mockComment = new Comment({
      id: 'comment-123',
      content: 'content',
      owner: 'user-123',
      thread: 'thread-123',
      date: expectedDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentByIdUseCase = new DeleteCommentByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentByIdUseCase.execute({
      userId: 'not the owner',
      threadId: 'thread-123',
      commentId: 'comment-123',
    })).rejects.toThrow('DELETE_COMMENT_USECASE.NOT_AUTHORIZED');
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
  });

  it('should orchestrating delete comment by id action correctly', async () => {
    // Arrange
    const expectedDate = new Date();
    const mockComment = new Comment({
      id: 'comment-123',
      content: 'content',
      owner: 'user-123',
      thread: 'thread-123',
      date: expectedDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentByIdUseCase = new DeleteCommentByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentByIdUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    });

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith('comment-123');
  });
});
