class Thread {
  constructor(payload) {
    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
    this.date = payload.date || new Date();
    this.isDeleted = payload.isDeleted || false;
    this.Comment = undefined;
    this.comments = [];

    this._verifyPayload(payload);
  }

  _verifyPayload(payload) {
    const {
      id,
      title,
      body,
      owner,
      date = new Date(),
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
      || !(date instanceof Date)
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

  set username(username) {
    if (typeof username !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    this._username = username;
  }

  get username() {
    return this._username;
  }

  initiateComments(comments) {
    if (!this.Comment) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    let instanceValid = true;
    comments.forEach((comment) => {
      if (!(comment instanceof this.Comment)) {
        instanceValid = false;
      }
    });

    if (!instanceValid) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.comments = comments;
  }
}

module.exports = Thread;
