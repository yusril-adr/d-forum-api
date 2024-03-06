const getToken = async (server) => {
  const userPayload = {
    username: 'dicoding',
    password: 'secret',
  };

  const userResponse = await server.inject({
    method: 'POST',
    url: '/users',
    payload: {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    },
  });
  const userResponseJson = JSON.parse(userResponse.payload);

  const response = await server.inject({
    method: 'POST',
    url: '/authentications',
    payload: userPayload,
  });

  const responseJson = JSON.parse(response.payload);

  return {
    accessToken: responseJson.data.accessToken,
    refreshToken: responseJson.data.refreshToken,
    userId: userResponseJson.data.addedUser.id,
  };
};

module.exports = getToken;
