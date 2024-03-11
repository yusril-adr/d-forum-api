/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'threadId',
    content = 'content',
    owner = 'ownerId',
    parent = 'commentId',
    createdAt = new Date(),
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, parent, createdAt, isDeleted],
    };

    await pool.query(query);
  },

  async findRepliesByParent(commentId) {
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
        ORDER BY
          replies."createdAt"
      `,
      values: [commentId],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async findRepliesById(id) {
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
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies');
  },
};

module.exports = RepliesTableTestHelper;
