const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'someId',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrow('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'someId',
      content: 'someContent',
      date: 'invalidDate',
      owner: 'someOwner',
      username: 123,
      parent: 'someComment',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrow('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'someId',
      content: 'someContent',
      owner: 'someOwner',
      parent: 'someParent',
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toEqual('someId');
    expect(reply.content).toEqual('someContent');
    expect(reply.owner).toEqual('someOwner');
    expect(reply.parent).toEqual('someParent');
    // Avoid using toBeLessThanOrEqual and toBeGreaterThanOrEqual
    // Because diffrent time of local test and database
    expect(() => new Date(reply.date)).not.toThrow(Error);
    expect(reply.isDeleted).toEqual(false);
    expect(reply.username).toBeUndefined();
  });

  it('should hide content when reply is deleted', () => {
    // Arrange
    const payload = {
      id: 'someId',
      content: 'someContent',
      owner: 'someOwner',
      parent: 'someParent',
      isDeleted: true,
    };

    // Action
    const reply = new Reply(payload);

    //  Assert
    expect(reply.content).not.toEqual('someContent');
  });

  describe('verifyOwner', () => {
    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'someOwner',
        parent: 'someParent',
      };

      // Action
      const reply = new Reply(payload);

      //  Assert
      expect(() => reply.verifyOwner(123)).toThrow('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should verify owner successfully', () => {
      // Arrange
      const payload = {
        id: 'someId',
        content: 'someContent',
        owner: 'validOwner',
        parent: 'someParent',
      };

      // Action
      const reply = new Reply(payload);

      //  Assert
      expect(reply.verifyOwner('notTheOwner')).toBeFalsy();
      expect(reply.verifyOwner('validOwner')).toBeTruthy();
    });
  });
});
