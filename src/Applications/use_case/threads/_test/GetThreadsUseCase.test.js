const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetThreadsUseCase = require('../GetThreadsUseCase');

describe('GetThreadsUseCase', () => {
  it('should orchestrating get threads action correctly', async () => {
    // Arrange
    const currentDate = new Date();

    const mockThread1 = new Thread({
      id: 'thread-1',
      title: 'title-1',
      body: 'body-1',
      owner: 'user-123',
      date: currentDate,
    });
    const mockThread2 = new Thread({
      id: 'thread-2',
      title: 'title-2',
      body: 'body-2',
      owner: 'user-123',
      date: currentDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreads = jest.fn()
      .mockImplementation(() => Promise.resolve([mockThread1, mockThread2]));

    /** creating use case instance */
    const getThreadsUseCase = new GetThreadsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threads = await getThreadsUseCase.execute();

    // Assert
    expect(mockThreadRepository.getThreads).toHaveBeenCalled();
    expect(threads).toHaveLength(2);
    expect(threads).toEqual([
      new Thread({
        id: 'thread-1',
        title: 'title-1',
        body: 'body-1',
        owner: 'user-123',
        date: currentDate,
      }),
      new Thread({
        id: 'thread-2',
        title: 'title-2',
        body: 'body-2',
        owner: 'user-123',
        date: currentDate,
      }),
    ]);
  });
});
