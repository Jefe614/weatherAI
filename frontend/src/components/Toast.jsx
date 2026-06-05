import { useEffect, useRef } from 'react'

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (!message) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [message, duration, onClose])

  if (!message) return null

  const colors = {
    success: 'bg-green-900 border-green-700 text-green-200',
    error: 'bg-red-900 border-red-700 text-red-200',
    info: 'bg-blue-900 border-blue-700 text-blue-200',
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md px-4 py-3 rounded-lg border ${colors[type]} shadow-lg animate-fadeIn z-50`}>
      {message}
    </div>
  )
}