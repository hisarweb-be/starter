"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

type AnimatedPresenceProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

const directionMap = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
}

export function FadeIn({ children, className, delay = 0, direction = "up" }: AnimatedPresenceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeInWhenVisible({ children, className, delay = 0, direction = "up" }: AnimatedPresenceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({ children, className, staggerDelay = 0.1 }: { children: ReactNode; className?: string; staggerDelay?: number }) {
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } },
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
