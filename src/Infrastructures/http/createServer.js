const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const config = require('../../Commons/config');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const ClientError = require('../../Commons/exceptions/ClientError');

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // External Plugin Registration
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Define auth strategy with jwt
  server.auth.strategy('dforum_jwt', 'jwt', {
    keys: config.authentication.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.authentication.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: threads,
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
