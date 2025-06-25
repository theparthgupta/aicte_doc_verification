"use client"

import { useState } from 'react'
import { Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatPdf } from '@/hooks/useChatPdf'

type ErrorChatbotProps ={
    pdfUrl:string
}

export default function ErrorChatbot({pdfUrl}:ErrorChatbotProps) {
  const [input, setInput] = useState('')
  const { messages, sendMessage, isConnected } = useChatPdf('ws://localhost:8000/chat-pdf', pdfUrl)

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="container w-auto mx-auto p-4 flex justify-center items-center min-h-screen">
      <Card className="w-full shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-medium">
            Error Chat Assistant
            {isConnected ? (
              <span className="ml-2 text-sm text-green-500">●</span>
            ) : (
              <span className="ml-2 text-sm text-red-500">●</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[50vh] p-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div 
                    className={`rounded-lg p-2 max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" size="icon" disabled={!input.trim() || !isConnected}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </motion.div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

