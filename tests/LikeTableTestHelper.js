/* istanbul ignore file */
const { nanoid } = require('nanoid');
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikessTableTestHelper = {
  async likeThread(threadId, userId) {
    const id = `thread_likes-${nanoid()}`;
    const query = {
      text: 'INSERT INTO thread_likes(id, thread, owner) VALUES($1, $2, $3)',
      values: [id, threadId, userId],
    };

    await pool.query(query);
  },

  async likeComment(threadId, userId) {
    const id = `comment_likes-${nanoid()}`;
    const query = {
      text: 'INSERT INTO comment_likes(id, comment, owner) VALUES($1, $2, $3)',
      values: [id, threadId, userId],
    };

    await pool.query(query);
  },

  async findLikesByThread(threadId) {
    const query = {
      text: `
        SELECT
          thread_likes.id,
          thread_likes.thread,
          thread_likes.owner
        FROM thread_likes
        WHERE
          thread_likes.thread = $1
        ORDER BY thread_likes."createdAt"
      `,
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findLikesByComment(commentId) {
    const query = {
      text: `
        SELECT
          comment_likes.id,
          comment_likes.comment,
          comment_likes.owner
        FROM comment_likes
        WHERE
        comment_likes.comment = $1
        ORDER BY comment_likes."createdAt"
      `,
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_likes');
    await pool.query('DELETE FROM comment_likes');
  },
};

module.exports = LikessTableTestHelper;
