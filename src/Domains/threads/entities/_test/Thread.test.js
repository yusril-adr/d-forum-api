const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'someId',
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrow('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'someId',
      title: 'someTitle',
      body: 'someBody',
      owner: 'someOwner',
      createdAt: 'invalidDate',
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrow('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'someId',
      title: 'someTitle',
      body: 'someBody',
      owner: 'someOwner',
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread).toBeInstanceOf(Thread);
    expect(thread.accessToken).toEqual(payload.accessToken);
    expect(thread.refreshToken).toEqual(payload.refreshToken);
  });

  describe('verifyOwner', () => {
    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'someId',
        title: 'someTitle',
        body: 'someBody',
        owner: 'validOwner',
      };

      // Action
      const thread = new Thread(payload);

      //  Assert
      expect(() => thread.verifyOwner(123)).toThrow('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should verify owner successfully', () => {
      // Arrange
      const payload = {
        id: 'someId',
        title: 'someTitle',
        body: 'someBody',
        owner: 'validOwner',
      };

      // Action
      const thread = new Thread(payload);

      //  Assert
      expect(thread.verifyOwner('notTheOwner')).toBeFalsy();
      expect(thread.verifyOwner('validOwner')).toBeTruthy();
    });
  });
});
