const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const AUTH_TOKEN_KEY = 'authToken';

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('isAdminLoggedIn');
}

export function getApiUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  const { onUnauthorized, ...fetchOptions } = options;

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(path), {
    ...fetchOptions,
    headers
  });

  if (response.status === 401) {
    clearAuthToken();
    onUnauthorized?.();
  }

  return response;
}

export { API_BASE_URL, AUTH_TOKEN_KEY };
