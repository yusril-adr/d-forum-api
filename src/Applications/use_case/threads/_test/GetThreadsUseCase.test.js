const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetThreadsUseCase = require('../GetThreadsUseCase');
const pool = require('../../../../Infrastructures/database/postgres/pool');

describe('GetThreadsUseCase', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should orchestrating get threads action correctly', async () => {
    // Arrange
    const expectedDate = new Date();

    const mockThread1 = new Thread({
      id: 'thread-1',
      title: 'title-1',
      body: 'body-1',
      owner: 'user-123',
      createdAt: expectedDate,
    });
    const mockThread2 = new Thread({
      id: 'thread-2',
      title: 'title-2',
      body: 'body-2',
      owner: 'user-123',
      createdAt: expectedDate,
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
    expect(threads).toHaveLength(2);
    expect(threads[0].id).toStrictEqual('thread-1');
    expect(threads[1].id).toStrictEqual('thread-2');
    expect(mockThreadRepository.getThreads).toHaveBeenCalled();
  });
});
