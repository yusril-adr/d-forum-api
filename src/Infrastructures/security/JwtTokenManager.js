const AuthenticationTokenManager = require('../../Applications/security/AuthenticationTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const config = require('../../Commons/config');

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.generate(payload, config.authentication.accessTokenKey);
  }

  async createRefreshToken(payload) {
    return this._jwt.generate(payload, config.authentication.refreshTokenKey);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, config.authentication.refreshTokenKey);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;
