const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

let accessToken: string | null = null;

export type ApiRecord = Record<string, unknown> & {
  id?: number | string;
  created_at?: string;
  updated_at?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  token?: string | null;
};

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function getApiBaseUrl() {
  if (!BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  return BASE_URL;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = options.token ?? accessToken;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      json?.message || json?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return json as T;
}
