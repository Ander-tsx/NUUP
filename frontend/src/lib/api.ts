import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

type RetriableConfig = InternalAxiosRequestConfig & {
  _retried?: boolean;
  _isRefreshAttempt?: boolean;
};

// Request interceptor: attach token from localStorage as Bearer header
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("pw_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const forceLogout = () => {
  localStorage.removeItem("pw_auth");
  localStorage.removeItem("pw_token");
  window.location.href = "/auth/login";
};

// Single in-flight refresh shared by all concurrent 401s — the refresh token
// is one-time use, so parallel refresh calls would invalidate each other.
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh", null, { _isRefreshAttempt: true } as RetriableConfig)
      .then((res) => {
        const token: string = res.data?.data?.token;
        if (token) localStorage.setItem("pw_token", token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Response interceptor: on 401 try one refresh (rotation), then retry the request
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const status = error.response?.status;
    const config = error.config as RetriableConfig | undefined;
    const isAuthPage = window.location.pathname.startsWith("/auth");

    // Refresh itself failed — token already used (replay), expired or missing
    if (config?._isRefreshAttempt) {
      if (!isAuthPage) forceLogout();
      return Promise.reject(error);
    }

    if (status === 401 && config && !config._retried && !isAuthPage) {
      config._retried = true;
      try {
        const token = await refreshAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return api(config);
      } catch {
        return Promise.reject(error);
      }
    }

    if (status === 401 && !isAuthPage) forceLogout();

    return Promise.reject(error);
  },
);

export default api;
