class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
    this.createdAt = payload.createdAt || new Date();
    this.isDeleted = payload.isDeleted || false;
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

    if (!id || !title || !body || !owner) {
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
  }
}

module.exports = Thread;
