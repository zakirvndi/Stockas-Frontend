import { deleteCookie, getCookie, setCookie } from '@/utils/cookies';

const API_BASE_URL = 'https://stockas.azurewebsites.net/api';

export async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    switch (response.status) {
      case 401:
      case 403:
        throw new Error('Incorrect email or password');
      case 429:
        throw new Error('Too many attempts. Please try again later');
      case 500:
        throw new Error('Server error. Please try again later');
      default:
        throw new Error('Login failed. Please try again');
    }
  }

  return await response.json();
}

export async function registerUser(credentials: { name: string; email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      
      if (errorData.errors?.Email?.includes('Email sudah terdaftar') || 
          errorData.errors?.email?.includes('Email sudah terdaftar') ||
          errorData.message?.includes('Email sudah terdaftar')) {
        throw new Error('Email sudah terdaftar');
      }
      
      throw new Error(errorData.message || 'Registration failed');
    } catch {
      throw new Error('Registration failed. Please try again');
    }
  }

  return await response.json();
}

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    const token = getCookie('token');
    if (!token) return { success: false };

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    deleteCookie('token');
    deleteCookie('refreshToken');
    deleteCookie('user');

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false };
  }
}

export async function fetchProtectedData() {
  const token = getCookie('token');
  if (!token) throw new Error('No token found');

  try {
    const response = await fetch(`${API_BASE_URL}/protected-route`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) {
          throw new Error('Session expired');
        }

        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: token,
            refreshToken: refreshToken
          }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Session expired');
        }

        const newTokens = await refreshResponse.json();
        setCookie('token', newTokens.token, 1);
        setCookie('refreshToken', newTokens.refreshToken, 7);
        
        return fetchProtectedData();
      }
      throw new Error('Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch protected data error:', error);
    throw error;
  }
}


interface UserProfile {
  name: string;
  email: string;
}

export async function fetchUserProfile(retries = 3): Promise<UserProfile> {
  const token = getCookie('token');
  if (!token) throw new Error('No authentication token found');

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchUserProfile(retries - 1);
      }
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    const profileData = Array.isArray(data) ? data[0] : data;

    return {
      name: profileData.name || 'User',
      email: profileData.email || ''
    };
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchUserProfile(retries - 1);
    }
    throw error;
  }
}