import { useState } from 'react'
import { FiImage } from 'react-icons/fi'

export default function Img({ src, alt = '', className = '', fallbackClass = '', iconSize = 'text-3xl' }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-ink-100 via-ink-50 to-brand-100 ${fallbackClass}`}
        role="img"
        aria-label={alt}
      >
        <FiImage className={`text-ink-300 ${iconSize}`} />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
      style={{ alignSelf: 'stretch' }}
    />
  )
}