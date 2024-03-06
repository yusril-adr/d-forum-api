class DeleteThreadById {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    thread.verifyOwner(userId);
    return this._threadRepository.deleteThreadById(threadId);
  }
}

module.exports = DeleteThreadById;
