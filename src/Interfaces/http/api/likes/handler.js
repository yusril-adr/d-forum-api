const LikeThreadUseCase = require('../../../../Applications/use_case/likes/LikeThreadUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/likes/LikeCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.putLikeThreadHandler = this.putLikeThreadHandler.bind(this);
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeThreadHandler(request, h) {
    const likeThreadUseCase = this._container.getInstance(LikeThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    await likeThreadUseCase.execute(userId, request.params.threadId);
    const response = h.response({
      status: 'success',
    });
    return response;
  }

  async putLikeCommentHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    const { id: userId } = request.auth.credentials;
    await likeCommentUseCase.execute({
      userId,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
    });
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = ThreadsHandler;
