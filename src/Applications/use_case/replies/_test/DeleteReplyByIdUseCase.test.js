const Reply = require('../../../../Domains/replies/entities/Reply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyByIdUseCase = require('../DeleteReplyByIdUseCase');

describe('DeleteReplyByIdUseCase', () => {
  it('should throw error when thread is not found', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    /** creating use case instance */
    const deleteReplyByIdUseCase = new DeleteReplyByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyByIdUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    })).rejects.toThrow(Error);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).not.toHaveBeenCalled();
    expect(mockReplyRepository.getReplyById).not.toHaveBeenCalled();
    expect(mockReplyRepository.deleteReplyById).not.toHaveBeenCalled();
  });

  it('should throw error when comment is not found', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentByIdUseCase = new DeleteReplyByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteCommentByIdUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    })).rejects.toThrow(Error);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getReplyById).not.toHaveBeenCalled();
    expect(mockReplyRepository.deleteReplyById).not.toHaveBeenCalled();
  });

  it('should throw error when reply is not found', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error()));
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyByIdUseCase = new DeleteReplyByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyByIdUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    })).rejects.toThrow(Error);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith('reply-123');
    expect(mockReplyRepository.deleteReplyById).not.toHaveBeenCalled();
  });

  it('should throw error when user id is not the owner', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const mockReply = new Reply({
      id: 'reply-123',
      content: 'content',
      owner: 'user-123',
      parent: 'comment-123',
    });

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyByIdUseCase = new DeleteReplyByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & ASSERT
    await expect(deleteReplyByIdUseCase.execute({
      userId: 'not the owner',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    })).rejects.toThrow('DELETE_REPLY_USECASE.NOT_AUTHORIZED');

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith('reply-123');
  });

  it('should orchestrating delete reply by id action correctly', async () => {
    // Arrange
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const mockReply = new Reply({
      id: 'reply-123',
      content: 'content',
      owner: 'user-123',
      parent: 'comment-123',
    });

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyByIdUseCase = new DeleteReplyByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyByIdUseCase.execute({
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    });

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith('comment-123');
    expect(mockReplyRepository.getReplyById).toHaveBeenCalledWith('reply-123');
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith('reply-123');
  });
});
