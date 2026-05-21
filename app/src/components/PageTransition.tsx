import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -24 },
}

const reduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

export function PageTransition({ children }: Props) {
  const location = useLocation()
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={prefersReduced ? reduced : variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="contents"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
