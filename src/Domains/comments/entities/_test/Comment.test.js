const Comment = require('../Comment');
const Reply = require('../../../replies/entities/Reply');

jest.mock('../../../replies/entities/Reply');

describe('Comment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'someId',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrow('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'someId',
      content: 'someContent',
      createdAt: 'invalidDate',
      owner: 'someOwner',
      thread: 'someThread',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrow('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'someId',
      content: 'someContent',
      owner: 'someOwner',
      thread: 'someThread',
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
  });

  it('should hide content when comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'someId',
      content: 'someContent',
      owner: 'validOwner',
      thread: 'someThread',
      isDeleted: true,
    };

    // Action
    const comment = new Comment(payload);

    //  Assert
    expect(comment.content).not.toEqual('someContent');
  });

  describe('verifyOwner', () => {
    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'someOwner',
        thread: 'someThread',
      };

      // Action
      const comment = new Comment(payload);

      //  Assert
      expect(() => comment.verifyOwner(123)).toThrow('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should verify owner successfully', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'validOwner',
        thread: 'someThread',
      };

      // Action
      const comment = new Comment(payload);

      //  Assert
      expect(comment.verifyOwner('notTheOwner')).toBeFalsy();
      expect(comment.verifyOwner('validOwner')).toBeTruthy();
    });
  });

  describe('username props', () => {
    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'validOwner',
        thread: 'someThread',
      };

      // Action
      const comment = new Comment(payload);

      //  Assert
      expect(() => { comment.username = 123; }).toThrow('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should return username value', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'validOwner',
        thread: 'someThread',
      };

      // Action
      const comment = new Comment(payload);
      comment.username = 'someUsername';

      //  Assert
      expect(comment.username).toEqual('someUsername');
    });
  });

  describe('initiateReplies', () => {
    it('should throw error when payload not contain needed property', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'validOwner',
        thread: 'someThread',
      };

      // Action
      const comment = new Comment(payload);

      // Assert
      expect(() => comment.initiateReplies([])).toThrow('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'validOwner',
        thread: 'someThread',
      };

      // Action
      const comment = new Comment(payload);
      comment.Reply = Reply;

      // Assert
      expect(() => comment.initiateReplies([1, 2])).toThrow('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should be able initiateReplies properly', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'validOwner',
        thread: 'someThread',
      };

      const mockReply1 = new Reply({
        id: 'reply-1', content: 'content', owner: 'owner', parent: 'parent',
      });
      const mockReply2 = new Reply({
        id: 'reply-1', content: 'content', owner: 'owner', parent: 'parent',
      });

      const mockReplies = [
        mockReply1,
        mockReply2,
      ];

      // Action
      const comment = new Comment(payload);
      comment.Reply = Reply;
      comment.initiateReplies(mockReplies);

      // Assert
      expect(comment.replies).toHaveLength(2);
      expect(comment.replies[0]).toStrictEqual(mockReply1);
      expect(comment.replies[1]).toStrictEqual(mockReply2);
    });
  });
});