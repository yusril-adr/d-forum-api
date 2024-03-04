const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'dforum_jwt',
    },
  },
]);

module.exports = routes;
