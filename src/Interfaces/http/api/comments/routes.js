const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'dforum_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentByIdHandler,
    options: {
      auth: 'dforum_jwt',
    },
  },
]);

module.exports = routes;
