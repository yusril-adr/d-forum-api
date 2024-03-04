const InvariantError = require('../../Commons/exceptions/InvariantError');
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
      title, body, owner, createdAt,
    } = thread;
    const id = `thread-${this._idGenerator()}`;

    let queryText = 'INSERT INTO threads VALUES($1, $2, $3, $4';
    const queryValues = [id, title, body, owner];

    if (createdAt) {
      queryText += ', $5';
      queryValues.push(createdAt);
    }

    queryText += ') RETURNING id, title, body, owner, "createdAt", "isDeleted"';

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
      text: 'SELECT id, title, body, owner, "createdAt" FROM threads WHERE "isDeleted" = $1',
      values: [false],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map((thread) => new Thread(thread));
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT id, title, body, owner, "createdAt", "isDeleted" FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('thread not found');
    }

    const thread = new Thread(result.rows[0]);

    return thread;
  }

  async deleteThreadById(threadId) {
    const query = {
      text: 'UPDATE threads SET "isDeleted" = $1 WHERE id = $2',
      values: [true, threadId],
    };
    await this._pool.query(query);
  }
}

module.exports = ThreadRepositoryPostgres;
