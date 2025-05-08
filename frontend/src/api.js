import axios from 'axios';

export function createApi({ getAccessToken, getRefreshToken, setAuthTokens, onLogout }) {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
  });

  // Attach access token to every request
  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle 401 errors and try to refresh token
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        getRefreshToken()
      ) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            `${api.defaults.baseURL.replace('/api', '')}/api/users/refresh`,
            { refreshToken: getRefreshToken() }
          );
          setAuthTokens(res.data.accessToken, getRefreshToken(), res.data.expiresIn);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          if (onLogout) onLogout();
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}

const defaultApi = createApi({
  getAccessToken: () => null,
  getRefreshToken: () => null,
  setAuthTokens: () => {},
  onLogout: () => {},
});
export default defaultApi;