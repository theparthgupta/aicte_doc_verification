import React from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, CheckCircle, XCircle, ChevronRight, Upload, Edit, FileType } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Application } from "@/schemas/applicationSchema"

const ApplicationModal: React.FC<{
  application: Application
  isOpen: boolean
  onClose: () => void
}> = ({ application, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-full h-screen max-h-screen overflow-hidden flex flex-col m-0 p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {application.application_name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-sm">
                {application.application_type}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Last updated: {new Date(application.documents[0].timestamp).toLocaleDateString()}
              </div>
            </div>
            <p className="text-muted-foreground">{application.application_description}</p>
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            {application.documents.map((doc, index) => (
              <motion.div
                key={doc.document_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {doc.document_name}
                    </CardTitle>
                    {doc.status === "approved" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48 w-full">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Last modified: {new Date(doc.timestamp).toLocaleString()}
                        </div>
                        {doc.errors && doc.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-red-500 mb-1">Errors:</p>
                            <ul className="list-disc list-inside text-xs text-muted-foreground">
                              {doc.errors.map((error, errorIndex) => (
                                <li key={errorIndex}>{JSON.stringify(error)}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    <div className="flex items-center justify-between mt-4">
                      <div className="space-x-2">
                        {(!doc.user_document_uri || doc.status !== "approved") && (
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        )}
                        {doc.user_document_uri && doc.errors && doc.errors.length > 0 && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                        {doc.user_document_uri && doc.status === "approved" && (!doc.errors || doc.errors.length === 0) && (
                          <Badge variant="success">Approved</Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <FileType className="h-4 w-4 mr-2" />
                          Format
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationModal

