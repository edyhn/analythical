import type { ReactNode } from "react"

import { LoadingState, EmptyState, ErrorState } from "@/components/states"

interface AsyncStatesProps {
  isLoading?: boolean
  error?: Error | null
  hasData?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  errorTitle?: string
  errorMessage?: string
  onRetry?: () => void
  loadingLabel?: string
}

/**
 * Mature loading / empty / error handling for data-driven views.
 *
 * Usage:
 *   <AsyncStates
 *     isLoading={isLoading}
 *     error={error}
 *     isEmpty={!tasks.length}
 *     emptyTitle="No tasks yet"
 *     onRetry={refresh}
 *   >
 *     <ActivityTable activities={tasks} />
 *   </AsyncStates>
 */
export function AsyncStates({
  isLoading,
  error,
  hasData = true,
  emptyTitle,
  emptyDescription,
  emptyAction,
  errorTitle,
  errorMessage,
  onRetry,
  loadingLabel,
  children,
}: AsyncStatesProps & { children: ReactNode }) {
  if (isLoading) return <LoadingState label={loadingLabel} />
  if (error)
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage}
        onRetry={onRetry}
      />
    )
  if (!hasData) {
    return (
      <EmptyState
        title={emptyTitle ?? "No data to display"}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }
  return <>{children}</>
}