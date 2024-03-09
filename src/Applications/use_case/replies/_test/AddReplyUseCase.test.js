const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const Reply = require('../../../../Domains/replies/entities/Reply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const pool = require('../../../../Infrastructures/database/postgres/pool');

describe('AddReplyUseCase', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', thread: 'thread-123' });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should throw error when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'someContent',
    };

    const fakeValidator = {
      validate: (_, payload) => payload,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      validator: fakeValidator,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      useCasePayload,
    })).rejects.toThrow(Error);
  });

  it('should throw error when comment is not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'someContent',
    };

    const fakeValidator = {
      validate: (_, payload) => payload,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      validator: fakeValidator,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      useCasePayload,
    })).rejects.toThrow(Error);
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const expectedDate = new Date();
    const useCasePayload = {
      content: 'someContent',
    };

    const fakeValidator = {
      validate: (schema, payload) => {
        const fakeValidatorHandler = {
          object: () => {},
          string: () => ({
            required: () => {},
          }),
        };
        schema(fakeValidatorHandler);
        return payload;
      },
    };

    const mockReply = new Reply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
      parent: 'comment-123',
      date: expectedDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      validator: fakeValidator,
    });

    // Action
    const createReply = await addReplyUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      useCasePayload,
    });

    // Assert
    expect(createReply).toStrictEqual(new Reply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
      parent: 'comment-123',
      date: expectedDate,
    }));

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith({
      content: useCasePayload.content,
      owner: 'user-123',
      parent: 'comment-123',
    });
  });
});
