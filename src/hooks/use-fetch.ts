import { useCallback, useEffect, useRef, useState } from "react"

interface FetchState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isRefreshing: boolean
}

interface UseFetchOptions<T> {
  enabled?: boolean
  initialData?: T | null
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  options: UseFetchOptions<T> = {},
) {
  const { enabled = true, initialData = null } = options
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    error: null,
    isLoading: enabled,
    isRefreshing: false,
  })

  // Keep the latest fetcher without retriggering on identity change.
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const optionsRef = useRef(options)
  optionsRef.current = options

  const run = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") {
        setState((s) => ({ ...s, isLoading: true, error: null }))
      } else {
        setState((s) => ({ ...s, isRefreshing: true, error: null }))
      }
      try {
        const result = await fetcherRef.current()
        setState({
          data: result,
          error: null,
          isLoading: false,
          isRefreshing: false,
        })
        optionsRef.current.onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setState((s) => ({
          ...s,
          error,
          isLoading: false,
          isRefreshing: false,
        }))
        optionsRef.current.onError?.(error)
        throw error
      }
    },
    [],
  )

  const refresh = useCallback(() => run("refresh"), [run])
  useEffect(() => {
    if (enabled) {
      void run("initial").catch(() => undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled])

  return { ...state, refresh }
}
