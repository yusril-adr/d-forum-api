/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'threadId',
    title = 'thread title',
    body = 'thread body',
    owner = 'ownerId',
    createdAt = new Date(),
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, owner, createdAt, isDeleted],
    };

    await pool.query(query);
  },

  async findThreads() {
    // Avoid using SELECT *
    const query = {
      text: `
        SELECT
          threads.id,
          threads.title,
          threads.body,
          threads.owner,
          users.username,
          threads."createdAt" as date,
          threads."isDeleted"
        FROM threads
        JOIN users
        ON threads.owner = users.id
        ORDER BY threads."createdAt"
      `,
    };
    const result = await pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  },

  async findThreadsById(id) {
    const query = {
      text: `
      SELECT
        threads.id,
        threads.title,
        threads.body,
        threads.owner,
        users.username,
        threads."createdAt" as date,
        threads."isDeleted"
      FROM threads
      JOIN users
      ON threads.owner = users.id
      WHERE
        threads.id = $1
      ORDER BY threads."createdAt"
      `,
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = ThreadsTableTestHelper;
