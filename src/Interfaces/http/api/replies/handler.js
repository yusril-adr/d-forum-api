const AddReplyUseCase = require('../../../../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyByIdUseCase = require('../../../../Applications/use_case/replies/DeleteReplyByIdUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedReply = await addReplyUseCase.execute({
      userId,
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      useCasePayload: request.payload,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;
    const deleteReplyByIdUseCase = this._container.getInstance(DeleteReplyByIdUseCase.name);
    await deleteReplyByIdUseCase.execute({
      userId,
      threadId,
      commentId,
      replyId,
    });
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;
