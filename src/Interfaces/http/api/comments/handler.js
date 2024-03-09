const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentByIdUseCase = require('../../../../Applications/use_case/comments/DeleteCommentByIdUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedComment = await addCommentUseCase.execute({
      userId,
      threadId: request.params.threadId,
      useCasePayload: request.payload,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentByIdUseCase = this._container.getInstance(DeleteCommentByIdUseCase.name);
    await deleteCommentByIdUseCase.execute({
      userId,
      threadId,
      commentId,
    });
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;
