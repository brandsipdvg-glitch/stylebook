import { FiStar } from 'react-icons/fi'

export default function Rating({ value = 0, count, size = 'h-3.5 w-3.5', className = '', showValue = true }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${className}`}>
      <FiStar className={`${size} fill-amber-400 text-amber-400`} />
      {showValue && <span className="text-inherit">{typeof value === 'number' ? value.toFixed(1) : value}</span>}
      {count != null && <span className="font-normal text-ink-400">({count})</span>}
    </span>
  )
}