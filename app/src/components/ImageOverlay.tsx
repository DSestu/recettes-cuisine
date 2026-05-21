import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  src: string | null
  alt?: string
  onClose: () => void
}

export function ImageOverlay({ src, alt, onClose }: Props) {
  useEffect(() => {
    if (!src) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [src, onClose])

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image en plein écran"
        >
          <img
            src={src}
            alt={alt ?? ''}
            className="max-w-full max-h-full w-auto h-auto object-contain select-none"
            draggable={false}
            onClick={e => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-[10002] inline-flex items-center justify-center rounded-full p-3 shadow border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
