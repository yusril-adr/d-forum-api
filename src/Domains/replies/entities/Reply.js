class Reply {
  constructor(payload) {
    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
    this.username = payload.username;
    this.parent = payload.parent;
    this.date = payload.date || new Date();
    this.isDeleted = payload.isDeleted || false;

    this._verifyPayload(payload);
  }

  _verifyPayload(payload) {
    const {
      id,
      content,
      owner,
      username,
      parent,
      createdAt = new Date(),
      isDeleted = false,
    } = payload;

    if (!content || !owner || !parent) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof owner !== 'string'
      || (username && (typeof username !== 'string'))
      || typeof parent !== 'string'
      || !(createdAt instanceof Date)
      || typeof isDeleted !== 'boolean'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (isDeleted) {
      this.content = '**balasan telah dihapus**';
    }
  }

  verifyOwner(userId) {
    if (typeof userId !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return this.owner === userId;
  }
}

module.exports = Reply;
