import { FiSearch, FiRefreshCw } from 'react-icons/fi'

export function EmptyState({ icon: Icon = FiSearch, title = 'Nothing here yet', message = 'Try adjusting your filters or come back later.', onAction, actionLabel, children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-50 text-ink-400 dark:bg-ink-800">
        <Icon className="h-9 w-9" />
      </div>
      <h3 className="text-lg font-bold text-ink-900 dark:text-white">{title}</h3>
      <p className="max-w-xs text-sm text-ink-500">{message}</p>
      {onAction && (
        <button onClick={onAction} className="btn-primary mt-2 text-xs">
          <FiRefreshCw className="h-4 w-4" />
          {actionLabel || 'Reset filters'}
        </button>
      )}
      {children}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong while loading data.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-900/30">
        <FiRefreshCw className="h-9 w-9" />
      </div>
      <h3 className="text-lg font-bold text-ink-900 dark:text-white">Oops!</h3>
      <p className="max-w-xs text-sm text-ink-500">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-dark mt-2 text-xs">
          <FiRefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  )
}