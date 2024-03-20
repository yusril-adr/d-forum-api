const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user-1' });
    await UsersTableTestHelper.addUser({ id: 'user-1234', username: 'user-2' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', thread: 'thread-123' });
  });

  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('likeThread', () => {
    it('should add like thread to database', async () => {
      // Arrange
      const payload = {
        owner: 'user-123',
        thread: 'thread-123',
      };
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.likeThread(payload.thread, payload.owner);

      // Assert
      const likes = await LikeTableTestHelper.findLikesByThread('thread-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('dislikeThread', () => {
    it('should remove like thread to database', async () => {
      // Arrange
      const payload = {
        owner: 'user-123',
        thread: 'thread-123',
      };
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await LikeTableTestHelper.likeThread(payload.thread, payload.owner);

      // Action
      await likeRepositoryPostgres.dislikeThread(payload.thread, payload.owner);

      // Assert
      const likes = await LikeTableTestHelper.findLikesByThread('thread-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('getThreadLikesCount', () => {
    it('should return count correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikeTableTestHelper.likeThread('thread-123', 'user-123');
      await LikeTableTestHelper.likeThread('thread-123', 'user-1234');

      const expected = await LikeTableTestHelper.findLikesByThread('thread-123');

      // Action
      const likeCount = await likeRepositoryPostgres.getThreadLikesCount('thread-123');

      // Assert
      expect(likeCount).toEqual(expected.length);
    });

    it('should return 0 when data is empty', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getThreadLikesCount('thread-123');

      // Assert
      expect(likeCount).toEqual(0);
    });
  });

  describe('checkIsLikedThread', () => {
    it('should return true if user already like the thread', async () => {
      // Arrange
      const payload = {
        thread: 'thread-123',
        owner: 'user-123',
      };
      await LikeTableTestHelper.likeThread(payload.thread, payload.owner);
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const result = await likeRepositoryPostgres.checkIsLikedThread(payload.thread, payload.owner);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false if like user not like the thread', async () => {
      // Arrange
      const payload = {
        thread: 'thread-123',
        owner: 'user-123',
      };
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const result = await likeRepositoryPostgres.checkIsLikedThread(payload.thread, payload.owner);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('likeComment', () => {
    it('should add like comment to database', async () => {
      // Arrange
      const payload = {
        owner: 'user-123',
        comment: 'comment-123',
      };
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.likeComment(payload.comment, payload.owner);

      // Assert
      const likes = await LikeTableTestHelper.findLikesByComment('comment-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('dislikeComment', () => {
    it('should remove like comment to database', async () => {
      // Arrange
      const payload = {
        owner: 'user-123',
        comment: 'comment-123',
      };
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      await LikeTableTestHelper.likeComment(payload.comment, payload.owner);

      // Action
      await likeRepositoryPostgres.dislikeComment(payload.comment, payload.owner);

      // Assert
      const likes = await LikeTableTestHelper.findLikesByComment('comment-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('getCommentLikesCount', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      await LikeTableTestHelper.likeComment('comment-123', 'user-123');
      await LikeTableTestHelper.likeComment('comment-123', 'user-1234');

      const expected = await LikeTableTestHelper.findLikesByComment('comment-123');

      // Action
      const likeCount = await likeRepositoryPostgres.getCommentLikesCount('comment-123');

      // Assert
      expect(likeCount).toEqual(expected.length);
    });

    it('should return 0 when data is empty', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getCommentLikesCount('comment-123');

      // Assert
      expect(likeCount).toEqual(0);
    });
  });

  describe('checkIsLikedComment', () => {
    it('should return true if user already like the comment', async () => {
      // Arrange
      const payload = {
        comment: 'comment-123',
        owner: 'user-123',
      };
      await LikeTableTestHelper.likeComment(payload.comment, payload.owner);
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const result = await likeRepositoryPostgres
        .checkIsLikedComment(payload.comment, payload.owner);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false if like user not like the comment', async () => {
      // Arrange
      const payload = {
        comment: 'comment-123',
        owner: 'user-123',
      };
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const result = await likeRepositoryPostgres
        .checkIsLikedComment(payload.comment, payload.owner);

      // Assert
      expect(result).toBeFalsy();
    });
  });
});
