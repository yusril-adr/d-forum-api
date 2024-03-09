const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../../tests/RepliesTableTestHelper');
const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const Comment = require('../../../../Domains/comments/entities/Comment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const Reply = require('../../../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const pool = require('../../../../Infrastructures/database/postgres/pool');

describe('GetThreadByIdUseCase', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', thread: 'thread-123' });
    await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123', parent: 'comment-123' });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should orchestrating get thread by id action correctly', async () => {
    // Arrange
    const expectedDate = new Date();

    const mockThread = new Thread({
      id: 'thread-123',
      title: 'title-1',
      body: 'body-1',
      owner: 'user-123',
      createdAt: expectedDate,
    });

    const mockComment = new Comment({
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
      thread: 'thread-123',
      date: expectedDate,
    });

    const mockReply = new Reply({
      id: 'reply-123',
      content: 'reply content',
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
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([mockComment]));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([mockReply]));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      Comment,
      Reply,
    });

    // Action
    const thread = await getThreadByIdUseCase.execute('thread-123');

    // Assert
    expect(thread).toStrictEqual(mockThread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
  });
});
