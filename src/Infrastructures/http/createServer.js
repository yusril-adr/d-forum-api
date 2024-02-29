const Hapi = require('@hapi/hapi');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const config = require('../../Commons/config');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const ClientError = require('../../Commons/exceptions/ClientError');

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug,
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },

  ]);

  server.ext('onPreResponse', (request, h) => {
    // Get response context from request
    const { response } = request;

    // If error, translate the error message and send error response
    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // Keep client error handling natively by Hapi, like 404, etc.
      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // If not Error, continue with the response (without intervention)
    return h.continue;
  });

  return server;
};

module.exports = createServer;
