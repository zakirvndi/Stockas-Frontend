import { getToken, getRefreshToken, setAuthTokens, clearAuthTokens, shouldRefreshToken } from '@/utils/auth';

const API_BASE_URL = 'https://stockas.azurewebsites.net/api';

const handleRefresh = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthTokens();
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        accessToken: getToken(),
        refreshToken 
      }),
    });

    if (!response.ok) {
      clearAuthTokens();
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    if (!data.token || !data.refreshToken) {
      throw new Error('Invalid token response');
    }

    setAuthTokens(data.token, data.refreshToken);
    return data.token;
  } catch (error) {
    clearAuthTokens();
    throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  if (shouldRefreshToken()) {
    try {
      await handleRefresh();
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw error;
    }
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  const token = getToken();
  if (token) {
    if (token.length > 4096) {
      console.error('Token size exceeds limits');
      clearAuthTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Invalid token size');
    }
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      try {
        const newToken = await handleRefresh();
        headers.set('Authorization', `Bearer ${newToken}`);
        
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include',
        });
        return retryResponse;
      } catch (refreshError) {
        clearAuthTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};