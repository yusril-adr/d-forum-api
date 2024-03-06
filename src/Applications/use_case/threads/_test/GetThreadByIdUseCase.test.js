const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const pool = require('../../../../Infrastructures/database/postgres/pool');

describe('GetThreadByIdUseCase', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should orchestrating get thread by id action correctly', async () => {
    // Arrange
    const expectedDate = new Date();

    const mockThread = new Thread({
      id: 'thread-1',
      title: 'title-1',
      body: 'body-1',
      owner: 'user-123',
      createdAt: expectedDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await getThreadByIdUseCase.execute('thread-1');

    // Assert
    expect(thread).toStrictEqual(mockThread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-1');
  });
});
