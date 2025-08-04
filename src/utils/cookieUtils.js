// src/utils/cookieUtils.js
import Cookies from 'js-cookie';

export const getAuthToken = () => {
  return Cookies.get('auth_token');
};
