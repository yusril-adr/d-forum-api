const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Comment = require('../../Domains/comments/entities/Comment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const {
      content, owner, thread, date,
    } = comment;
    const id = `comment-${this._idGenerator()}`;

    let queryText = 'INSERT INTO comments VALUES($1, $2, $3, $4';
    const queryValues = [id, content, owner, thread];

    if (date) {
      queryText += ', $5';
      queryValues.push(date);
    }

    queryText += ') RETURNING id, content, owner, thread, "createdAt" as date, "isDeleted"';

    const query = {
      text: queryText,
      values: queryValues,
    };

    const result = await this._pool.query(query);

    return new Comment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(threadId) {
    // Avoid using SELECT *
    const query = {
      text: `
        SELECT
          comments.id,
          comments.content,
          comments.owner,
          comments.thread,
          users.username,
          comments."createdAt" as date,
          comments."isDeleted"
        FROM comments
        JOIN users
        ON comments.owner = users.id
        WHERE
          comments.thread = $1
        ORDER BY comments."createdAt"
      `,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map((comment) => new Comment(comment));
  }

  async getCommentById(commentId) {
    const query = {
      text: `
      SELECT
        comments.id,
        comments.content,
        comments.owner,
        comments.thread,
        users.username,
        comments."createdAt" as date,
        comments."isDeleted"
      FROM comments
      JOIN users
      ON comments.owner = users.id
      WHERE
        comments.id = $1
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment not found');
    }

    const comment = new Comment(result.rows[0]);
    return comment;
  }

  async verifyCommentAvailability(commentId) {
    const query = {
      text: `
      SELECT
        COUNT(1)
      FROM comments
      WHERE
        comments.id = $1
    `,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].count < 1) {
      throw new NotFoundError('comment not found');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET "isDeleted" = $1 WHERE id = $2',
      values: [true, commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment not found');
    }
  }
}

module.exports = CommentRepositoryPostgres;
