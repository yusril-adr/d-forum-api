const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const Comment = require('../../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentByIdUseCase = require('../DeleteCommentByIdUseCase');
const pool = require('../../../../Infrastructures/database/postgres/pool');

describe('DeleteCommentByIdUseCase', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should throw error when thread is not found', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
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
    expect(deleteCommentByIdUseCase.execute({
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
    mockThreadRepository.getThreadById = jest.fn()
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
    expect(deleteCommentByIdUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    })).rejects.toThrow(Error);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
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
    mockThreadRepository.getThreadById = jest.fn()
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
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith('comment-123');
  });
});
