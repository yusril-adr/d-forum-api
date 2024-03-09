const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const Comment = require('../../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const pool = require('../../../../Infrastructures/database/postgres/pool');

describe('AddCommentUseCase', () => {
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
    const useCasePayload = {
      content: 'someContent',
    };

    const fakeValidator = {
      validate: (_, payload) => payload,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      validator: fakeValidator,
    });

    // Action & Assert
    expect(addCommentUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      useCasePayload,
    })).rejects.toThrow(Error);
  });

  it('should orchestrating the add comment action correctly', async () => {
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

    const mockComment = new Comment({
      id: 'comment-1',
      content: useCasePayload.content,
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
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      validator: fakeValidator,
    });

    // Action
    const createdComment = await addCommentUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      useCasePayload,
    });

    // Assert
    expect(createdComment).toStrictEqual(new Comment({
      id: 'comment-1',
      content: useCasePayload.content,
      owner: 'user-123',
      thread: 'thread-123',
      date: expectedDate,
    }));

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');

    expect(mockCommentRepository.addComment).toHaveBeenCalledWith({
      content: useCasePayload.content,
      owner: 'user-123',
      thread: 'thread-123',
    });
  });
});
