"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, AlertTriangle, FileWarning, History } from 'lucide-react'

interface Upload {
  id: string
  fileName: string
  uploadDate: string
  layoutErrors: number
  placeholderErrors: number
  pdfUrl: string
}

interface PreviousUploadsDialogProps {
  uploads: Upload[]
}

export default function PreviousUploadsDialog({ uploads }: PreviousUploadsDialogProps) {
  const handleRowClick = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <History className="h-4 w-4" />
          View Upload History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Previous Uploads
          </DialogTitle>
          <DialogDescription>
            Click on a row to open the corresponding PDF in a new tab.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Layout Errors</TableHead>
                <TableHead>Placeholder Errors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads.map((upload) => (
                <TableRow
                  key={upload.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(upload.pdfUrl)}
                >
                  <TableCell>{upload.fileName}</TableCell>
                  <TableCell>{upload.uploadDate}</TableCell>
                  <TableCell>
                    <Badge variant={upload.layoutErrors > 0 ? "destructive" : "secondary"} className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {upload.layoutErrors}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={upload.placeholderErrors > 0 ? "destructive" : "secondary"} className="flex items-center gap-1">
                      <FileWarning className="h-3 w-3" />
                      {upload.placeholderErrors}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

