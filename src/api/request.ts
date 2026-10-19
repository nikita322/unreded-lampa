const REQUEST_TIMEOUT_MS = 10_000;

export interface RequestOptions {
  readonly method?: 'GET' | 'POST';
  readonly body?: unknown;
  readonly timeoutMs?: number;
  readonly headers?: Record<string, string>;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * GET/POST с JSON и таймаутом. Ошибки HTTP превращаются в ApiError.
 */
export async function requestJson<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const method = options.method ?? 'GET';
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const hasBody = options.body !== undefined;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: hasBody
        ? { 'Content-Type': 'application/json', ...options.headers }
        : options.headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Request failed: ${response.status}`);
    }

    const data: unknown = await response.json();
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}
