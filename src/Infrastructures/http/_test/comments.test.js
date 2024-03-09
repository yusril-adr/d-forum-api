const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const { initUser, getToken } = require('../../../../tests/TokenTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

let userId;

describe('/threads/{threadId}/comments endpoint', () => {
  beforeAll(async () => {
    const server = await createServer(container);
    userId = (await initUser(server)).userId;
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
  });

  afterAll(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'someContent',
      };

      const server = await createServer(container);

      const { accessToken } = await getToken(server);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
      };
      const server = await createServer(container);

      // Action
      const { accessToken } = await getToken(server);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: ['Some content'],
      };
      const server = await createServer(container);

      // Action
      const { accessToken } = await getToken(server);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 if commentId and threadId is found', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await getToken(server);

      await CommentsTableTestHelper.addComment({ id: 'comment-1', owner: userId, thread: 'thread-123' });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-1',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await getToken(server);
      await CommentsTableTestHelper.addComment({ id: 'comment-1', owner: userId, thread: 'thread-123' });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-124/comments/comment-1',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when comment is not found', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await getToken(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
