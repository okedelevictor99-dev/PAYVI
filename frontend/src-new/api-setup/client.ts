// api-setup/client.ts
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const client = axios.create({ baseURL });

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const REFRESH_TOKEN_KEY = "refreshToken";

export const setRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// Lets AuthProvider clear `user` when the session can't be refreshed
let onSessionExpired: (() => void) | null = null;

export const setSessionExpiredHandler = (handler: (() => void) | null) => {
  onSessionExpired = handler;
};

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const REFRESH_PATH = "/auth/refresh";

const PUBLIC_AUTH_PATHS = [
  "/auth/register",
  "/auth/login",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/forgot-password",
  "/auth/verify-reset-otp",
  "/auth/reset-password",
];

const isPublicAuthRequest = (url?: string) =>
  !!url && PUBLIC_AUTH_PATHS.some((path) => url.includes(path));

// One shared refresh for all concurrent 401s (the refresh token rotates,
// so parallel refreshes would invalidate each other)
let refreshPromise: Promise<void> | null = null;

const refreshSession = () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");

      const { data } = await client.post(REFRESH_PATH, { refreshToken });

      setAccessToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken); // rotated token
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

client.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall = originalRequest?.url?.includes(REFRESH_PATH);
    const isPublicAuth = isPublicAuthRequest(originalRequest?.url);

    if (
      !originalRequest ||
      !isUnauthorized ||
      isRefreshCall ||
      isPublicAuth ||
      originalRequest._retry
    ) {
      return Promise.reject(error); // keep the AxiosError so pages can read it
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
    } catch {
      setAccessToken(null);
      setRefreshToken(null);
      onSessionExpired?.();
      return Promise.reject(error);
    }

    return client(originalRequest);
  }
);