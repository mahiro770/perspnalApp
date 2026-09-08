const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * バックエンド共通fetchラッパー。
 * 認証はCloudflare Accessがエッジで担うため、ここではトークン付与は行わない
 * (同一オリジン/信頼済みオリジンへのCookieはブラウザが自動送信する想定)。
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(res.status, text || `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: 'GET', signal }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/**
 * API呼び出しを試み、失敗時(未接続バックエンド・ネットワークエラー等)は
 * フォールバックのモックデータを返す。画面を空にしないための共通ヘルパー。
 */
export async function withMockFallback<T>(loader: () => Promise<T>, mock: T): Promise<T> {
  try {
    return await loader();
  } catch (err) {
    console.warn('[API fallback] モックデータを使用します:', err);
    return mock;
  }
}
