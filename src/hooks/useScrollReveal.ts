import { useEffect, useRef, useState } from 'react'

export function useScrollReveal<T extends HTMLElement>(options?: {
  threshold?: number
  delay?: number
}) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), options?.delay ?? 0)
          observer.unobserve(el)
        }
      },
      { threshold: options?.threshold ?? 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.threshold, options?.delay])

  return { ref, visible }
}
