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
      date: 'invalidDate',
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
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
  });

  it('should hide title and body content when thread is deleted', () => {
    // Arrange
    const payload = {
      id: 'someId',
      title: 'someTitle',
      body: 'someBody',
      owner: 'validOwner',
      isDeleted: true,
    };

    // Action
    const thread = new Thread(payload);

    //  Assert
    expect(thread.title).not.toEqual('someTitle');
    expect(thread.body).not.toEqual('someBody');
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

  describe('username props', () => {
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
      expect(() => { thread.username = 123; }).toThrow('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should return username value', () => {
      // Arrange
      const payload = {
        id: 'someId',
        title: 'someTitle',
        body: 'someBody',
        owner: 'validOwner',
      };

      // Action
      const thread = new Thread(payload);
      thread.username = 'someUsername';

      //  Assert
      expect(thread.username).toEqual('someUsername');
    });
  });
});
