class DeleteThreadById {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread.verifyOwner(userId)) {
      throw new Error('DELETE_THREAD_USECASE.NOT_AUTHORIZED');
    }
    return this._threadRepository.deleteThreadById(threadId);
  }
}

module.exports = DeleteThreadById;
