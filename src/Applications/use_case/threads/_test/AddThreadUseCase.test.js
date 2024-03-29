const Thread = require('../../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const expectedDate = new Date();
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };

    const fakeValidator = {
      validate: (schema, payload) => {
        const fakeValidatorHandler = {
          object: () => {},
          string: () => ({
            required: () => {},
          }),
        };
        schema(fakeValidatorHandler);
        return payload;
      },
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
    expect(createdThread).toEqual(new Thread({
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
