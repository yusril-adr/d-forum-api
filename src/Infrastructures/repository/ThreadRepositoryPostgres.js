const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Thread = require('../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const {
      title, body, owner, date,
    } = thread;
    const id = `thread-${this._idGenerator()}`;

    let queryText = 'INSERT INTO threads VALUES($1, $2, $3, $4';
    const queryValues = [id, title, body, owner];

    if (date) {
      queryText += ', $5';
      queryValues.push(date);
    }

    queryText += ') RETURNING id, title, body, owner, "createdAt" as date, "isDeleted"';

    const query = {
      text: queryText,
      values: queryValues,
    };

    const result = await this._pool.query(query);

    return new Thread({ ...result.rows[0] });
  }

  async getThreads() {
    // Avoid using SELECT *
    const query = {
      text: `
        SELECT
          threads.id,
          threads.title,
          threads.body,
          threads.owner,
          users.username,
          threads."createdAt"
        FROM threads
        JOIN users
        ON threads.owner = users.id
        WHERE
          threads."isDeleted" = $1
        ORDER BY threads."createdAt"
      `,
      values: [false],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map((thread) => {
      const res = new Thread(thread);
      res.username = thread.username;
      return res;
    });
  }

  async getThreadById(threadId) {
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
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }

    const thread = new Thread(result.rows[0]);
    thread.username = result.rows[0].username;

    return thread;
  }

  async deleteThreadById(threadId) {
    const query = {
      text: 'UPDATE threads SET "isDeleted" = $1 WHERE id = $2',
      values: [true, threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
