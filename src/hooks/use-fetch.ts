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
  const requestGenerationRef = useRef(0)
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      requestGenerationRef.current += 1
    }
  }, [])

  const run = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      const requestGeneration = ++requestGenerationRef.current

      if (mode === "initial") {
        setState((s) => ({ ...s, isLoading: true, isRefreshing: false, error: null }))
      } else {
        setState((s) => ({ ...s, isLoading: false, isRefreshing: true, error: null }))
      }
      try {
        const result = await fetcherRef.current()
        if (isMountedRef.current && requestGeneration === requestGenerationRef.current) {
          setState({
            data: result,
            error: null,
            isLoading: false,
            isRefreshing: false,
          })
          optionsRef.current.onSuccess?.(result)
        }
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        if (isMountedRef.current && requestGeneration === requestGenerationRef.current) {
          setState((s) => ({
            ...s,
            error,
            isLoading: false,
            isRefreshing: false,
          }))
          optionsRef.current.onError?.(error)
        }
        throw error
      }
    },
    [],
  )

  const refresh = useCallback(() => run("refresh"), [run])

  // When the hook becomes disabled, invalidate any active request so it can no
  // longer commit data, error, a callback, or terminal loading state, and
  // normalize the loading indicators to false without dropping cached data.
  useEffect(() => {
    if (!enabled) {
      requestGenerationRef.current += 1
      setState((s) => ({ ...s, isLoading: false, isRefreshing: false }))
    }
  }, [enabled])

  useEffect(() => {
    if (enabled) {
      void run("initial").catch(() => undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled])

  return { ...state, refresh }
}
