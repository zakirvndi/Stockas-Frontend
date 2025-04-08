import { getCookie, setCookie, deleteCookie } from './cookies';

export const setAuthTokens = (token: string, refreshToken: string) => {
  setCookie('token', token, 1);
  setCookie('refreshToken', refreshToken, 7);
};

export const getToken = (): string | undefined => getCookie('token');
export const getRefreshToken = (): string | undefined => getCookie('refreshToken');

export const clearAuthTokens = () => {
  deleteCookie('token');
  deleteCookie('refreshToken');
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const shouldRefreshToken = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresIn = (payload.exp * 1000) - Date.now();
    return expiresIn < 300000;
  } catch {
    return false;
  }
};