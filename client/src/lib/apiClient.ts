/**
 * Axios API client for the real Express backend.
 * - baseURL from env (VITE_API_BASE_URL)
 * - request interceptor attaches the Firebase ID token (or demo token) as Bearer
 * - response interceptor unwraps the { success, data } envelope and normalizes errors
 *
 * The token is provided via `setAuthToken` (called by the auth layer) to avoid a circular
 * import between the store and this module.
 */
import axios, { AxiosError } from 'axios';
import { env } from './env';
import type { ApiResponse } from '@shared/types';

let authToken: string | null = null;
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export interface NormalizedError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

/** Unwrap a successful envelope's `data`; throw a NormalizedError otherwise. */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const res = await promise;
    const body = res.data;
    if (body.success) return body.data;
    throw { status: 400, code: body.error.code, message: body.error.message, details: body.error.details };
  } catch (err) {
    const ax = err as AxiosError<ApiResponse<unknown>>;
    if (ax.isAxiosError) {
      const body = ax.response?.data;
      const normalized: NormalizedError = {
        status: ax.response?.status ?? 0,
        code: body && !body.success ? body.error.code : 'network_error',
        message:
          body && !body.success ? body.error.message : ax.message || 'Network error',
      };
      throw normalized;
    }
    throw err;
  }
}
