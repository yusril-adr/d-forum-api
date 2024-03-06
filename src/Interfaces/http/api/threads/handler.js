const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');
const GetThreadsUseCase = require('../../../../Applications/use_case/threads/GetThreadsUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/threads/GetThreadByIdUseCase');
const DeleteThreadByIdUseCase = require('../../../../Applications/use_case/threads/DeleteThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadsHandler = this.getThreadsHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    this.deleteThreadByIdHandler = this.deleteThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(userId, request.payload);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadsHandler(_, h) {
    const getThreadsUseCase = this._container.getInstance(GetThreadsUseCase.name);
    const threads = await getThreadsUseCase.execute();
    const response = h.response({
      status: 'success',
      data: {
        threads,
      },
    });
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const { id: threadId } = request.params;
    const getThreadByIdUseCase = this._container.getInstance(GetThreadByIdUseCase.name);
    const thread = await getThreadByIdUseCase.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
  }

  async deleteThreadByIdHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: threadId } = request.params;
    const deleteThreadByIdUseCase = this._container.getInstance(DeleteThreadByIdUseCase.name);
    await deleteThreadByIdUseCase.execute(userId, threadId);
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = ThreadsHandler;
