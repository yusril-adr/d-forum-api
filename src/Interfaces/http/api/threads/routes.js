const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'dforum_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads',
    handler: handler.getThreadsHandler,
  },
  {
    method: 'GET',
    path: '/threads/{id}',
    handler: handler.getThreadByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{id}',
    handler: handler.deleteThreadByIdHandler,
    options: {
      auth: 'dforum_jwt',
    },
  },
]);

module.exports = routes;
