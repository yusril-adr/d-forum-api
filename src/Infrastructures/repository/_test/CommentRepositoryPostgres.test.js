const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const Comment = require('../../../Domains/comments/entities/Comment');

describe('CommentRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment', () => {
    it('should add comment to database', async () => {
      // Arrange
      const comment = {
        content: 'content',
        owner: 'user-123',
        thread: 'thread-123',
        date: new Date(),
      };
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.addComment(comment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      const date = new Date();
      // Arrange
      const newComment = new Comment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        thread: 'thread-123',
        date,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(createdComment).toStrictEqual(new Comment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        thread: 'thread-123',
        date,
      }));
    });

    it('should add date comment correctly if not given initial value', async () => {
      // Arrange
      const newComment = {
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        thread: 'thread-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(createdComment.date).toBeDefined();
      // Avoid using toBeLessThanOrEqual and toBeGreaterThanOrEqual
      // Because diffrent time of local test and database
      expect(() => new Date(createdComment.date)).not.toThrow(Error);
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({ id: 'test1', owner: 'user-123', thread: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'test2', owner: 'user-123', thread: 'thread-123' });

      // Action
      const comments = await commentRepository.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toBe('test1');
      expect(comments[0].owner).toBe('user-123');
      expect(comments[0].thread).toBe('thread-123');
      expect(comments[0].content).toBe('content');
      expect(comments[0].isDeleted).toBeFalsy();
      expect(comments[0].date).toBeDefined();
      // Avoid using toBeLessThanOrEqual and toBeGreaterThanOrEqual
      // Because diffrent time of local test and database
      expect(() => new Date(comments[0].date)).not.toThrow(Error);
      expect(comments[1].id).toBe('test2');
      expect(comments[1].owner).toBe('user-123');
      expect(comments[1].thread).toBe('thread-123');
      expect(comments[1].content).toBe('content');
      expect(comments[1].isDeleted).toBeFalsy();
      expect(comments[1].date).toBeDefined();
      // Avoid using toBeLessThanOrEqual and toBeGreaterThanOrEqual
      // Because diffrent time of local test and database
      expect(() => new Date(comments[1].date)).not.toThrow(Error);
    });

    it('should return empty array when payload is valid', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(0);
    });
  });

  describe('getCommentById', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.getCommentById('notFoundId'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should return comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment1', owner: 'user-123', thread: 'thread-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment1');

      // Assert
      expect(comment.id).toEqual('comment1');
    });
  });

  describe('verifyCommentAvailability', () => {
    it('should throw error when comment is not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepository.verifyCommentAvailability('comment-123')).rejects.toThrow(NotFoundError);
    });

    it('should not throw error when comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', thread: 'thread-123' });
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepository.verifyCommentAvailability('comment-123')).resolves.not.toThrow(Error);
    });
  });

  describe('deleteCommentById', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById('notFoundId'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should delete comment from database', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({
        id: 'test1', content: 'someContent', owner: 'user-123', thread: 'thread-123',
      });

      // Action
      await commentRepositoryPostgres.deleteCommentById('test1');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('test1');
      expect(comments[0].isDeleted).toBeTruthy();
    });
  });
});
