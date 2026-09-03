export const formatLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())

export const formatPercent = (value: number) => `${Math.round(value * 100)}%`

export const formatDuration = (seconds: number | null) => {
  if (seconds === null || !Number.isFinite(seconds)) return "—"
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`
  return `${(seconds / 86400).toFixed(1)}d`
}
