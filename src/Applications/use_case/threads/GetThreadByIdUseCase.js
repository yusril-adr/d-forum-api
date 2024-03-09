class GetThreadByIdUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    Comment,
    Reply,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._Comment = Comment;
    this._Reply = Reply;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const Comment = this._Comment;
    const Reply = this._Reply;

    const populatedComments = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

      comment.Reply = Reply;
      comment.initiateReplies(replies);
      return comment;
    }));

    thread.Comment = Comment;
    thread.initiateComments(populatedComments);

    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
