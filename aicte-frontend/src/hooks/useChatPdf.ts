import { useState, useEffect, useCallback, useRef } from 'react'

interface Message {
  id: number
  role: 'user' | 'ai'
  content: string
}

export function useChatPdf(url: string, pdfUrl:string) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', content: 'Hello! I can help you understand the errors in your document. What would you like to know?' }
  ])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    const socket = new WebSocket(url)

    socket.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.content) {
        setMessages(prev => [...prev, { id: Date.now(), role: 'ai', content: data.content }])
      }
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
      setTimeout(connect, 5000) // Attempt to reconnect after 5 seconds
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socketRef.current = socket
  }, [url])

  useEffect(() => {
    connect()
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [connect])

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const newUserMessage = { id: Date.now(), role: 'user' as const, content }
      setMessages(prev => [...prev, newUserMessage])
      socketRef.current.send(JSON.stringify({ message: content, pdf_url: pdfUrl }))
    } else {
      console.error('WebSocket is not connected')
    }
  }, [])

  return { messages, sendMessage, isConnected }
}
