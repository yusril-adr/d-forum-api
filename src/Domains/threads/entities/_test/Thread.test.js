const Thread = require('../Thread');
const Comment = require('../../../comments/entities/Comment');

jest.mock('../../../comments/entities/Comment');

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
      username: 123,
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

  describe('initiateComments', () => {
    it('should throw error when payload not contain needed property', () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 'someTitle',
        body: 'someBody',
        owner: 'ownerId',
      };

      // Action
      const thread = new Thread(payload);

      // Assert
      expect(() => thread.initiateComments([])).toThrow('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 'someTitle',
        body: 'someBody',
        owner: 'ownerId',
      };

      // Action
      const thread = new Thread(payload);
      thread.Comment = Comment;

      // Assert
      expect(() => thread.initiateComments([1, 2])).toThrow('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should be able initiateComments properly', () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 'someTitle',
        body: 'someBody',
        owner: 'ownerId',
      };

      const mockComment1 = new Comment({
        id: 'comment-1', content: 'content', owner: 'owner', thread: 'thread-123',
      });
      const mockComment2 = new Comment({
        id: 'comment-1', content: 'content', owner: 'owner', thread: 'thread-123',
      });

      const mockComments = [
        mockComment1,
        mockComment2,
      ];

      // Action
      const thread = new Thread(payload);
      thread.Comment = Comment;
      thread.initiateComments(mockComments);

      // Assert
      expect(thread.comments).toHaveLength(2);
      expect(thread.comments[0]).toStrictEqual(mockComment1);
      expect(thread.comments[1]).toStrictEqual(mockComment2);
    });
  });
});
