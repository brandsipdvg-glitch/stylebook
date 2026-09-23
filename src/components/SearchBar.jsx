import { FiSearch } from 'react-icons/fi'

export default function SearchBar({ value, onChange, onFocus, onKeyDown, placeholder = 'Search hairstyles, salons…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="input pl-12 py-4 !rounded-2xl"
        aria-label={placeholder}
      />
    </div>
  )
}