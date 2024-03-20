class Comment {
  constructor(payload) {
    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
    this.username = payload.username;
    this.likeCount = payload.likeCount || 0;
    this.thread = payload.thread;
    this.date = payload.date || new Date();
    this.isDeleted = payload.isDeleted || false;
    this.Reply = undefined;
    this.replies = [];

    this._verifyPayload(payload);
  }

  _verifyPayload(payload) {
    const {
      id,
      content,
      owner,
      username,
      likeCount = 0,
      thread,
      date = new Date(),
      isDeleted = false,
    } = payload;

    if (!content || !owner || !thread) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof owner !== 'string'
      || (username && (typeof username !== 'string'))
      || typeof likeCount !== 'number'
      || typeof thread !== 'string'
      || !(date instanceof Date)
      || typeof isDeleted !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (isDeleted) {
      this.content = '**komentar telah dihapus**';
    }
  }

  verifyOwner(userId) {
    if (typeof userId !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    return this.owner === userId;
  }

  initiateReplies(replies) {
    if (!this.Reply) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    let instanceValid = true;
    replies.forEach((reply) => {
      if (!(reply instanceof this.Reply)) {
        instanceValid = false;
      }
    });

    if (!instanceValid) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.replies = replies;
  }
}

module.exports = Comment;
