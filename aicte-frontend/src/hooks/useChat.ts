'use client'

import { useEffect, useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatHookResult {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => void
}

const SOCKET_URL = 'ws://127.0.0.1:8000/chatbot'

export function useChat(): ChatHookResult {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL)
    setSocket(ws)
  
    ws.onopen = () => {
      console.log('WebSocket connected')
      setIsLoading(false)
    }

    ws.onerror = (event) => {
      console.error('WebSocket error:', event)
      setError(new Error('WebSocket connection failed'))
    }

    ws.onmessage = (event) => {
      const newMessage: Message = {
        role: 'assistant',
        content: event.data,
      }
      setMessages((prevMessages) => [...prevMessages, newMessage])
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      ws.close()
    }
  }, [])

  const sendMessage = (content: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const userMessage: Message = { role: 'user', content }
      setMessages((prevMessages) => [...prevMessages, userMessage])
      socket.send(content)
    } else {
      console.error('WebSocket is not open')
      setError(new Error('WebSocket is not open'))
    }
  }

  return { messages, isLoading, error, sendMessage }
}
