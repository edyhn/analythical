export interface ApiErrorDetails {
  status?: number
  message: string
}

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new ApiError("The request timed out.", 0)),
      ms,
    )
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (reason) => {
        clearTimeout(timer)
        reject(reason)
      },
    )
  })
}

async function parseError(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}.`
  try {
    const body = await response.json()
    if (body && typeof body.message === "string") {
      message = body.message
    }
  } catch {
    // Ignore non-JSON error bodies.
  }
  return new ApiError(message, response.status)
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs: number = 10000,
): Promise<T> {
  const controller = new AbortController()

  const response = await withTimeout(
    fetch(`${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
      signal: controller.signal,
      credentials: "include",
    }),
    timeoutMs,
  )

  if (!response.ok) {
    throw await parseError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string, timeoutMs?: number) =>
    request<T>(path, { method: "GET" }, timeoutMs),
  post: <T>(path: string, body?: unknown, timeoutMs?: number) =>
    request<T>(
      path,
      { method: "POST", body: body ? JSON.stringify(body) : undefined },
      timeoutMs,
    ),
  put: <T>(path: string, body?: unknown, timeoutMs?: number) =>
    request<T>(
      path,
      { method: "PUT", body: body ? JSON.stringify(body) : undefined },
      timeoutMs,
    ),
  patch: <T>(path: string, body?: unknown, timeoutMs?: number) =>
    request<T>(
      path,
      { method: "PATCH", body: body ? JSON.stringify(body) : undefined },
      timeoutMs,
    ),
  delete: <T>(path: string, timeoutMs?: number) =>
    request<T>(path, { method: "DELETE" }, timeoutMs),
}
