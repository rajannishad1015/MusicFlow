'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number] // Custom easing for premium feel
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
