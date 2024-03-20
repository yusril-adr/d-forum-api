const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeThread(threadId, userId) {
    const id = `thread_likes-${this._idGenerator()}`;

    const queryText = 'INSERT INTO thread_likes VALUES($1, $2, $3)';
    const queryValues = [id, userId, threadId];

    const query = {
      text: queryText,
      values: queryValues,
    };

    await this._pool.query(query);
  }

  async dislikeThread(threadId, userId) {
    const query = {
      text: 'DELETE FROM thread_likes WHERE thread = $1 AND owner = $2',
      values: [threadId, userId],
    };
    await this._pool.query(query);
  }

  async getThreadLikesCount(threadId) {
    const query = {
      text: `
        SELECT
          COUNT(id) as "likeCount"
        FROM thread_likes
        WHERE
          thread = $1
      `,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    return parseInt(result.rows[0].likeCount, 36);
  }

  async checkIsLikedThread(threadId, userId) {
    const query = {
      text: `
      SELECT
        COUNT(1)
      FROM thread_likes
      WHERE
        thread = $1
        AND owner = $2
    `,
      values: [threadId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].count > 0;
  }

  async likeComment(commentId, userId) {
    const id = `comment_likes-${this._idGenerator()}`;

    const queryText = 'INSERT INTO comment_likes VALUES($1, $2, $3)';
    const queryValues = [id, userId, commentId];

    const query = {
      text: queryText,
      values: queryValues,
    };

    await this._pool.query(query);
  }

  async dislikeComment(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment = $1 AND owner = $2',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async getCommentLikesCount(commentId) {
    const query = {
      text: `
        SELECT
          COUNT(id) as "likeCount"
        FROM comment_likes
        WHERE
          comment = $1
      `,
      values: [commentId],
    };
    const result = await this._pool.query(query);

    return parseInt(result.rows[0].likeCount, 36);
  }

  async checkIsLikedComment(commentId, userId) {
    const query = {
      text: `
      SELECT
        COUNT(1)
      FROM comment_likes
      WHERE
        comment = $1
        AND owner = $2
    `,
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows[0].count > 0;
  }
}

module.exports = LikeRepositoryPostgres;
