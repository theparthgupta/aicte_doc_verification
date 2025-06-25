'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, MessageCircle } from 'lucide-react'
import { useChat } from "@/hooks/useChat"

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}
interface Message {
  role: 'user' | 'assistant'
  content: string
}

const renderMessage = (message: Message) => {
  let content = message.content
  if (typeof content === 'string' && content.startsWith('{')) {
    try {
      const parsedContent = JSON.parse(content)
      content = parsedContent.content || content
    } catch (e) {
      console.error('Failed to parse message content:', e)
    }
  }
  return content
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { messages, isLoading, sendMessage } = useChat()
  const [input, setInput] = React.useState('')
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
    console.log(isLoading)
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
        console.log("input", input)
      sendMessage(input)
      setInput('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 w-96 bg-background border rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              AICTE Handbook Assistant
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {renderMessage(message)}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-muted-foreground">
                <span className="animate-pulse">...</span>
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about AICTE handbook..."
                className="flex-grow"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}