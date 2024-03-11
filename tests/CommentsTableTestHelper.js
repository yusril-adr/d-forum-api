/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'threadId',
    content = 'content',
    owner = 'ownerId',
    thread = 'threadId',
    createdAt = new Date(),
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, thread, createdAt, isDeleted],
    };

    await pool.query(query);
  },

  async findCommentsByThread(threadId) {
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

    const result = await pool.query(query);
    return result.rows;
  },

  async findCommentsById(id) {
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
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },
};

module.exports = CommentsTableTestHelper;
