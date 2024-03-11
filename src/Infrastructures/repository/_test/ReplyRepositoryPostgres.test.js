const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('ReplyRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', thread: 'thread-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply', () => {
    it('should add reply to database', async () => {
      // Arrange
      const reply = {
        content: 'content',
        owner: 'user-123',
        parent: 'comment-123',
        date: new Date(),
      };
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(reply);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return created reply correctly', async () => {
      const date = new Date();
      // Arrange
      const newReply = new Reply({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
        parent: 'comment-123',
        date,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(createdReply).toStrictEqual(new Reply({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
        parent: 'comment-123',
        date,
      }));
    });

    it('should add date reply correctly if not given initial value', async () => {
      // Arrange
      const newReply = {
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
        parent: 'comment-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(createdReply.date).toBeDefined();
      // Avoid using toBeLessThanOrEqual and toBeGreaterThanOrEqual
      // Because diffrent time of local test and database
      expect(() => new Date(createdReply.date)).not.toThrow(Error);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return replies correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.addReply({ id: 'test1', owner: 'user-123', parent: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'test2', owner: 'user-123', parent: 'comment-123' });

      const [expectedReply1, expectedReply2] = await RepliesTableTestHelper.findRepliesByParent('comment-123');

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies).toEqual([
        new Reply(expectedReply1),
        new Reply(expectedReply2),
      ]);
    });

    it('should return empty array when payload is valid', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toHaveLength(0);
    });
  });

  describe('getReplyById', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.getReplyById('notFoundId'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should return reply correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'test1', owner: 'user-123', parent: 'comment-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const [expectedReply] = await RepliesTableTestHelper.findRepliesById('test1');

      // Action
      const comment = await replyRepositoryPostgres.getReplyById('test1');

      // Assert
      expect(comment).toEqual(expectedReply);
    });
  });

  describe('verifyReplyAvailability', () => {
    it('should throw error when reply is not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123')).rejects.toThrow(NotFoundError);
    });

    it('should not throw error when reply is found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123', parent: 'comment-123' });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123')).resolves.not.toThrow(Error);
    });
  });

  describe('deleteReplyById', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReplyById('notFoundId'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should delete reply from database', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await RepliesTableTestHelper.addReply({
        id: 'test1', content: 'someContent', owner: 'user-123', parent: 'comment-123',
      });
      const [expectedReply] = await RepliesTableTestHelper.findRepliesById('test1');

      // Action
      await replyRepositoryPostgres.deleteReplyById('test1');

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('test1');
      expect(replies[0].isDeleted).toBeTruthy();
      expect(new Reply(replies[0])).toEqual(new Reply({ ...expectedReply, isDeleted: true }));
    });
  });
});
