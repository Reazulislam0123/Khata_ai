// src/hooks/useApiClient.ts
// Axios-like fetch wrapper that auto-attaches Firebase ID Token
// Use this for all authenticated API calls

import { getIdToken } from "@/lib/firebase";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function apiCall<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {} } = options;

  // Attach Firebase token automatically
  const token = await getIdToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: data.error || `Request failed with status ${res.status}`,
        status: res.status,
      };
    }

    return { data: data as T, error: null, status: res.status };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Network error",
      status: 0,
    };
  }
}

// Convenience shortcuts
export const api = {
  get: <T>(url: string) => apiCall<T>(url, { method: "GET" }),
  post: <T>(url: string, body: unknown) => apiCall<T>(url, { method: "POST", body }),
  put: <T>(url: string, body: unknown) => apiCall<T>(url, { method: "PUT", body }),
  patch: <T>(url: string, body: unknown) => apiCall<T>(url, { method: "PATCH", body }),
  delete: <T>(url: string) => apiCall<T>(url, { method: "DELETE" }),
};

