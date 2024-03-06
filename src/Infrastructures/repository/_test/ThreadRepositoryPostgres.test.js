const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const Thread = require('../../../Domains/threads/entities/Thread');

describe('ThreadRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread', () => {
    it('should add thread to database', async () => {
      // Arrange
      const thread = {
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
        createdAt: new Date(),
      };
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepository.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      const createdAt = new Date();
      // Arrange
      const newThread = new Thread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
        createdAt,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(createdThread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
        createdAt,
      }));
    });

    it('should add createdAt thread correctly if not given initial value', async () => {
      // Arrange
      const newThread = {
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(createdThread.createdAt).toBeDefined();
      expect(createdThread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
        createdAt: createdThread.createdAt,
      }));
    });
  });

  describe('getThreads', () => {
    it('should return threads correctly', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({ id: 'test1', owner: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'test2', owner: 'user-123' });

      // Action
      const threads = await threadRepository.getThreads();

      // Assert
      expect(threads).toHaveLength(2);
      expect(threads[0].id).toBe('test1');
      expect(threads[1].id).toBe('test2');
    });

    it('should not return deleted threads', async () => {
      // Arrange
      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({ id: 'test1', owner: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'test2', owner: 'user-123', isDeleted: true });

      // Action
      const threads = await threadRepository.getThreads();

      // Assert
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toBe('test1');
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('notFoundId'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread1', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread1');

      // Assert
      expect(thread.id).toEqual('thread1');
    });
  });

  describe('deleteThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.deleteThreadById('notFoundId'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should delete thread from database', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({ id: 'test1', owner: 'user-123' });

      // Action
      await threadRepositoryPostgres.deleteThreadById('test1');

      // Assert
      const threads = await threadRepositoryPostgres.getThreads();
      expect(threads).toHaveLength(0);
    });
  });
});
