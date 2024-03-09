const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Reply = require('../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const {
      content, owner, parent, date,
    } = reply;
    const id = `reply-${this._idGenerator()}`;

    let queryText = 'INSERT INTO replies VALUES($1, $2, $3, $4';
    const queryValues = [id, content, owner, parent];

    if (date) {
      queryText += ', $5';
      queryValues.push(date);
    }

    queryText += ') RETURNING id, content, owner, parent, "createdAt" as date, "isDeleted"';

    const query = {
      text: queryText,
      values: queryValues,
    };

    const result = await this._pool.query(query);

    return new Reply({ ...result.rows[0] });
  }

  async getRepliesByCommentId(commentId) {
    // Avoid using SELECT *
    const query = {
      text: `
        SELECT
          replies.id,
          replies.content,
          replies.owner,
          replies.parent,
          users.username,
          replies."createdAt" as date,
          replies."isDeleted"
        FROM replies
        JOIN users
        ON replies.owner = users.id
        WHERE
          replies.parent = $1
        ORDER BY replies."createdAt"
      `,
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map((reply) => new Reply(reply));
  }

  async getReplyById(replyId) {
    const query = {
      text: `
      SELECT
        replies.id,
        replies.content,
        replies.owner,
        replies.parent,
        users.username,
        replies."createdAt" as date,
        replies."isDeleted"
      FROM replies
      JOIN users
      ON replies.owner = users.id
      WHERE
        replies.id = $1
      `,
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply not found');
    }

    const reply = new Reply(result.rows[0]);

    return reply;
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET "isDeleted" = $1 WHERE id = $2',
      values: [true, replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('reply not found');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
