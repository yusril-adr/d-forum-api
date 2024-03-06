class Thread {
  constructor(payload) {
    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
    this.createdAt = payload.createdAt || new Date();
    this.isDeleted = payload.isDeleted || false;

    this._verifyPayload(payload);
  }

  _verifyPayload(payload) {
    const {
      id,
      title,
      body,
      owner,
      createdAt = new Date(),
      isDeleted = false,
    } = payload;

    if (!title || !body || !owner) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof owner !== 'string'
      || !(createdAt instanceof Date)
      || typeof isDeleted !== 'boolean'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (isDeleted) {
      this.title = '**thread telah dihapus**';
      this.body = '**thread telah dihapus**';
    }
  }

  verifyOwner(userId) {
    if (typeof userId !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return this.owner === userId;
  }

  /*
    TODO:
      - Add get detailedThread
        - Alias owner into username
        - Populate comments and replies
      - Add set comments with each item is instance of Comment
  */
}

module.exports = Thread;
