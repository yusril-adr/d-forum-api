class getThreadsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute() {
    return this._threadRepository.getThreads();
  }
}

module.exports = getThreadsUseCase;
