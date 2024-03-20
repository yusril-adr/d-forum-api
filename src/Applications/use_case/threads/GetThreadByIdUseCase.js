class GetThreadByIdUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
    Comment,
    Reply,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
    this._Comment = Comment;
    this._Reply = Reply;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    thread.likeCount = await this._likeRepository.getThreadLikesCount(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const Comment = this._Comment;
    const Reply = this._Reply;

    const populatedComments = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      comment.likeCount = await this._likeRepository.getCommentLikesCount(comment.id);
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
