const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DeleteThreadByIdUseCase = require('../DeleteThreadByIdUseCase');

describe('DeleteThreadByIdUseCase', () => {
  it('should throw error when user id is not the owner', async () => {
    // Arrange
    const expectedDate = new Date();
    const mockThread = new Thread({
      id: 'thread-1',
      title: 'title-1',
      body: 'body-1',
      owner: 'user-123',
      date: expectedDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockThreadRepository.deleteThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteThreadByIdUseCase = new DeleteThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(
      deleteThreadByIdUseCase.execute('not the owner', 'thread-1'),
    ).rejects.toThrow('DELETE_THREAD_USECASE.NOT_AUTHORIZED');

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-1');
    expect(mockThreadRepository.deleteThreadById).not.toHaveBeenCalled();
  });

  it('should orchestrating delete thread by id action correctly', async () => {
    // Arrange
    const expectedDate = new Date();
    const mockThread = new Thread({
      id: 'thread-1',
      title: 'title-1',
      body: 'body-1',
      owner: 'user-123',
      date: expectedDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockThreadRepository.deleteThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteThreadByIdUseCase = new DeleteThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteThreadByIdUseCase.execute('user-123', 'thread-1');

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-1');
    expect(mockThreadRepository.deleteThreadById).toHaveBeenCalledWith('thread-1');
  });
});
