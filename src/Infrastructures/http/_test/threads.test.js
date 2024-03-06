const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const getToken = require('../../../../tests/TokenTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'someTitle',
        body: 'someBody',
      };

      const server = await createServer(container);

      const { accessToken } = await getToken(server);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Some Title',
      };
      const server = await createServer(container);

      // Action
      const { accessToken } = await getToken(server);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        title: 'Some Title',
        body: ['some body'],
      };
      const server = await createServer(container);

      // Action
      const { accessToken } = await getToken(server);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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

  describe('when GET /threads', () => {
    it('should response 200 and return threads', async () => {
      // Arrange
      const server = await createServer(container);

      // Create Users to avoid owner key constraint
      const { userId } = await getToken(server);

      await ThreadsTableTestHelper.addThread({ id: 'thread-1', title: 'title-1', owner: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-2', title: 'title-2', owner: userId });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-3', title: 'title-3', owner: userId, isDeleted: true,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.threads).toBeDefined();
      expect(responseJson.data.threads[0].id).toBe('thread-1');
      expect(responseJson.data.threads[1].id).toBe('thread-2');
    });
  });

  describe('when GET /threads/{id}', () => {
    it('should response 200 if thread id is found', async () => {
      // Arrange
      const server = await createServer(container);

      // Create Users to avoid owner key constraint
      const { userId } = await getToken(server);

      await ThreadsTableTestHelper.addThread({ id: 'thread-1', title: 'title-1', owner: userId });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBe('thread-1');
    });

    it('should response 200 and hide content if thread is deleted', async () => {
      // Arrange
      const server = await createServer(container);

      // Create Users to avoid owner key constraint
      const { userId } = await getToken(server);

      await ThreadsTableTestHelper.addThread({
        id: 'thread-1', title: 'title-1', owner: userId, isDeleted: true,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBe('thread-1');
      expect(responseJson.data.thread.title).not.toBe('title-1');
    });

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Create Users to avoid owner key constraint
      await getToken(server);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{id}', () => {
    it('should response 200 if thread id is found', async () => {
      // Arrange
      const server = await createServer(container);

      // Create Users to avoid owner key constraint
      const { accessToken, userId } = await getToken(server);

      await ThreadsTableTestHelper.addThread({ id: 'thread-1', title: 'title-1', owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1',
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

      // Create Users to avoid owner key constraint
      const { accessToken } = await getToken(server);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-1',
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
