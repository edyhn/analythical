/**
 * Config for the Analythical WEB client.
 *
 * The base URL defaults to the Fastify service and can be overridden at
 * runtime via the `VITE_API_BASE_URL` environment variable (see `.env.example`).
 */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"

export const API_TIMEOUT_MS: number = Number(
  import.meta.env.VITE_API_TIMEOUT_MS ?? 10000,
)
