import { useEffect, useState } from 'react'

export function useTypewriter(words: string[], speed = 80, deleteSpeed = 40, pause = 2000) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [dir, setDir] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    const word = words[wordIdx]
    let timer: ReturnType<typeof setTimeout>

    if (dir === 'forward') {
      if (text.length < word.length) {
        timer = setTimeout(() => setText(word.slice(0, text.length + 1)), speed)
      } else {
        timer = setTimeout(() => setDir('backward'), pause)
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(word.slice(0, text.length - 1)), deleteSpeed)
      } else {
        setWordIdx((wordIdx + 1) % words.length)
        setDir('forward')
      }
    }

    return () => clearTimeout(timer)
  }, [text, wordIdx, dir, words, speed, deleteSpeed, pause])

  return text
}
