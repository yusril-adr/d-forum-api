/* eslint-disable default-case */
const Joi = require('joi');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler,
    options: {
      description: 'POST authentications',
      notes: 'Test',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }).label('Post-authentications-payload'),
      },
      response: {
        schema: Joi.object({
          status: 'success',
          data: {
            accessToken: Joi.string(),
            refreshToken: Joi.string(),
          },
        }).label('Post-authentications-response'),
      },
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler,
    options: {
      description: 'PUT authentications',
      notes: 'Test',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required(),
        }).label('Put-authentications-payload'),
      },
      response: {
        schema: Joi.object({
          status: 'success',
          data: {
            accessToken: Joi.string(),
          },
        }).label('Put-authentications-response'),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
    options: {
      description: 'DELETE authentications',
      notes: 'Test',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          refreshToken: Joi.string().required(),
        }).label('Delete-authentications-payload'),
      },
      response: {
        schema: Joi.object({
          status: 'success',
        }).label('Delete-authentications-response'),
      },
    },
  },
]);

module.exports = routes;
