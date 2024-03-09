const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper');
const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const pool = require('../../../../Infrastructures/database/postgres/pool');

describe('AddThreadUseCase', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const expectedDate = new Date();
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };

    const fakeValidator = {
      validate: (_, payload) => payload,
    };

    const mockThread = new Thread({
      id: 'thread-1',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'user-123',
      date: expectedDate,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    /** creating use case instance */
    const addThreadUsecase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      validator: fakeValidator,
    });

    // Action
    const createdThread = await addThreadUsecase.execute('user-123', useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(new Thread({
      id: 'thread-1',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'user-123',
      date: expectedDate,
    }));

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'user-123',
    });
  });
});
