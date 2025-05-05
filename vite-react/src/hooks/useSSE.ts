import { useCallback, useEffect, useRef, useState } from 'react'

export function useSSE<T>(url: string, maxRetries = 3, retryDelay = 3_000) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Event | null>(null)
  const [status, setStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected')
  const esRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const tries = useRef(0)

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    clearReconnectTimeout()

    if (esRef.current) {
      esRef.current.close()
    }

    setStatus('connecting')

    const es = new EventSource(url)
    esRef.current = es

    es.onmessage = (e) => {
      try {
        setData(JSON.parse(e.data))
        tries.current = 0
        setError(null)
        setStatus('connected')
      } catch {
        /* ignore parse errors */
      }
    }

    es.onopen = () => {
      setStatus('connected')
    }

    es.onerror = (e) => {
      setError(e)
      setStatus('disconnected')
      es.close()

      if (tries.current++ < maxRetries) {
        console.log('Retrying connection...')
        clearReconnectTimeout()

        reconnectTimeoutRef.current = setTimeout(
          connect,
          retryDelay
        ) as unknown as number
      }
    }
  }, [url, maxRetries, retryDelay, clearReconnectTimeout])

  useEffect(() => {
    connect()
    return () => {
      clearReconnectTimeout()
      if (esRef.current) {
        esRef.current.close()
        esRef.current = null
      }
      setStatus('disconnected')
    }
  }, [connect, clearReconnectTimeout])

  const stop = useCallback(() => {
    clearReconnectTimeout()
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }
    setStatus('disconnected')
  }, [clearReconnectTimeout])

  const restart = useCallback(() => {
    tries.current = 0
    setData(null)
    setError(null)
    connect()
  }, [connect])

  return { data, error, status, stop, restart }
}
