'use client'

import { useEffect, useState } from 'react'

type Phrase = {
  text: string
  dir?: 'ltr' | 'rtl'
}

const phrases: Phrase[] = [
  { text: 'Hello, Welcome' },
  { text: 'Hola, Bienvenido' },
  { text: 'مرحباً، أهلاً وسهلاً', dir: 'rtl' },
  { text: 'Ciao, Benvenuto' },
  { text: '你好，欢迎' },
]

export function TypingHeading({
  className,
  typingSpeed = 80,
  deletingSpeed = 100,
  pauseDuration = 3200,
}: {
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const current = phrases[phraseIndex]

  useEffect(() => {
    if (!isDeleting && charIndex === current.text.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
      return
    }

    const timeout = setTimeout(
      () => setCharIndex((prev) => prev + (isDeleting ? -1 : 1)),
      isDeleting ? deletingSpeed : typingSpeed
    )
    return () => clearTimeout(timeout)
  }, [
    charIndex,
    isDeleting,
    current.text,
    pauseDuration,
    typingSpeed,
    deletingSpeed,
  ])

  return (
    <h1 className={className} dir={current.dir ?? 'ltr'}>
      {current.text.slice(0, charIndex)}
      <span className="animate-blink">|</span>
    </h1>
  )
}
