import {Actions} from 'react-native-router-flux';

import Config from './config';
import Storage from './storage';
import {Alert} from 'react-native';

const refreshToken = async (refreshUrl, login, token) => {
  return fetch(refreshUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: login,
      token: token,
    }),
  }).then((res) => {
    const userInfo = res.json();

    return userInfo;
  });
};

export default class Authorization {
  static getAccessToken = async () => {
    try {
      const userInfo = await Storage.getItem('userInfo');

      if (userInfo.access_token && Date.now() < userInfo.expires_on) {
        return userInfo.access_token;
      } else if (userInfo.refresh_token) {
        const data = await refreshToken(
          Config.Data.apiConfig.refresh,
          userInfo.login,
          userInfo.refresh_token,
        );

        if (data.access_token) {
          await Storage.setItem(
            'userInfo',
            JSON.stringify({login: userInfo.login, ...data}),
          );

          return data.access_token;
        } else {
          await Authorization.logout(userInfo.login);
          return new Error(error);
        }
      } else {
        return new Error(error);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  static logout = async (login) => {
    try {
      await fetch(Config.Data.apiConfig.logout, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({login: login}),
      });
      try {
        await Storage.removeItem('userInfo');
        Actions.login();
      } catch (error) {
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
}
