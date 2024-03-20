const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const Comment = require('../../../../Domains/comments/entities/Comment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const Reply = require('../../../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating get thread by id action correctly', async () => {
    // Arrange
    const currentDate = new Date();
    const expectedDate = new Date(currentDate);

    const mockThread = new Thread({
      id: 'thread-123',
      title: 'title-1',
      body: 'body-1',
      owner: 'user-123',
      date: currentDate,
    });

    const mockComment = new Comment({
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
      thread: 'thread-123',
      date: currentDate,
    });

    const mockReply = new Reply({
      id: 'reply-123',
      content: 'reply content',
      owner: 'user-123',
      parent: 'comment-123',
      date: currentDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([mockComment]));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([mockReply]));
    mockLikeRepository.getThreadLikesCount = jest.fn()
      .mockImplementation(() => Promise.resolve(2));
    mockLikeRepository.getCommentLikesCount = jest.fn()
      .mockImplementation(() => Promise.resolve(2));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
      Comment,
      Reply,
    });

    // Expected values
    const expectedThread = new Thread({
      id: 'thread-123',
      title: 'title-1',
      body: 'body-1',
      owner: 'user-123',
      date: expectedDate,
      likeCount: 2,
    });

    const expectedComment = new Comment({
      id: 'comment-123',
      content: 'comment content',
      owner: 'user-123',
      thread: 'thread-123',
      date: expectedDate,
      likeCount: 2,
    });

    const expectedReply = new Reply({
      id: 'reply-123',
      content: 'reply content',
      owner: 'user-123',
      parent: 'comment-123',
      date: expectedDate,
    });

    expectedComment.Reply = Reply;
    expectedComment.replies = [expectedReply];
    expectedThread.Comment = Comment;
    expectedThread.comments = [expectedComment];

    // Action
    const thread = await getThreadByIdUseCase.execute('thread-123');

    // Assert
    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockLikeRepository.getThreadLikesCount).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockLikeRepository.getCommentLikesCount).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
  });
});
