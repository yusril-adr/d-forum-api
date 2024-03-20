const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/likes',
    handler: handler.putLikeThreadHandler,
    options: {
      auth: 'dforum_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.putLikeCommentHandler,
    options: {
      auth: 'dforum_jwt',
    },
  },
]);

module.exports = routes;
