const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const { initUser, getToken } = require('../../../../tests/TokenTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

let userId;

describe('', () => {
  beforeAll(async () => {
    const server = await createServer(container);
    userId = (await initUser(server)).userId;
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: userId, thread: 'thread-123' });
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await LikeTableTestHelper.cleanTable();
  });

  describe('/threads/{threadId}/likes endpoint', () => {
    describe('when PUT /threads/{threadId}/likes', () => {
      it('should response 200', async () => {
        // Arrange
        const server = await createServer(container);

        const { accessToken } = await getToken(server);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/likes',
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

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-404/likes',
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

  describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
      it('should response 200', async () => {
        // Arrange
        const server = await createServer(container);

        const { accessToken } = await getToken(server);

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-123/likes',
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

        // Action
        const response = await server.inject({
          method: 'PUT',
          url: '/threads/thread-404/comments/comment-123/likes',
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
          method: 'PUT',
          url: '/threads/thread-123/comments/comment-404/likes',
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
});
