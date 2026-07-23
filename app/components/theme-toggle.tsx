'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  if (!mounted) {
    return <div className="fixed top-4 right-4 z-50 w-6 h-6" aria-hidden="true" />
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="fixed top-4 right-4 z-50 w-6 h-6 rounded-full border border-neutral-400 bg-black transition-colors hover:opacity-80 dark:border-neutral-600 dark:bg-white"
    />
  )
}
