const API_BASE_URL = "/api/backend";

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
    };

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  return response.json() as Promise<ApiResponse<T>>;
}
