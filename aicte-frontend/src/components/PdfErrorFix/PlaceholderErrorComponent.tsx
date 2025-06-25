"use client"

import { useState } from 'react'
import { AlertCircle, ChevronDown, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ErrorItem {
  value: string
  analysis: {
    is_valid: boolean
    confidence: number
    issues: string[]
    suggestions: string[]
  }
}

interface ErrorDisplayProps {
  errors: Record<string, ErrorItem>
}

export default function ErrorDisplay({ errors }: ErrorDisplayProps) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  const toggleOpen = (key: string) => {
    setOpenStates(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex justify-center min-h-[40%] mt-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-red-50 dark:bg-red-900">
          <CardTitle className="text-red-700 dark:text-red-100 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Placeholder Value Errors
          </CardTitle>
          <p className="text-sm text-red-600 dark:text-red-200">
            The following fields contain invalid placeholder values that need attention.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[55vh] rounded-b-lg">
            <div className="p-4 space-y-4">
              {Object.entries(errors).map(([key, error]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="border-red-100 dark:border-red-800 overflow-hidden"
                    onClick={() => toggleOpen(key)}
                  >
                    <CardHeader className="py-2 cursor-pointer">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span>{key}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive">
                            {`${error.analysis.issues.length} Issue${error.analysis.issues.length !== 1 ? 's' : ''}`}
                          </Badge>
                          <motion.div
                            animate={{ rotate: openStates[key] ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <AnimatePresence>
                      {openStates[key] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="pt-0 pb-4">
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center justify-between">
                              </div>
                              <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="text-xs">Provided Value</AlertTitle>
                                <AlertDescription className="mt-1 max-h-20 overflow-y-auto text-xs">
                                  {error.value}
                                </AlertDescription>
                              </Alert>
                              {error.analysis.issues.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-xs mb-1">Issues:</h4>
                                  <ul className="list-disc pl-4 space-y-1 text-xs">
                                    {error.analysis.issues.map((issue, index) => (
                                      <li key={index}>{issue}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {error.analysis.suggestions.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-xs mb-1">Suggestions:</h4>
                                  <ul className="list-disc pl-4 space-y-1 text-xs">
                                    {error.analysis.suggestions.map((suggestion, index) => (
                                      <li key={index}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

