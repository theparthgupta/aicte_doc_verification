import React, { useEffect, useState, useRef } from "react";
import { extractTextFromPDF, FormattedTextBlock } from "@/lib/pdfjs-setup";
import { MarkdownEditor } from "./MarkdownEditor";
import { Loader2, Download, Upload, FileUp } from "lucide-react";
import { usePDFConverter } from "@/hooks/usePdfConverter";
import { Button } from "@/components/ui/button";
import { useFileUpload, useFileVerification } from "@/hooks/useFileUpload";

interface PDFMarkdownConverterProps {
  url: string;
  doc_id: string;
  onError?: (error: string) => void;
  format_uri: string;
  uni_application_id: string;
  currentUniDoc: ApplicationDocument[];
}

const PDFMarkdownConverter: React.FC<PDFMarkdownConverterProps> = ({
  url: initialUrl,
  onError,
  format_uri,
  uni_application_id,
  doc_id,
  currentUniDoc,
}) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<FormattedTextBlock[]>([]);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const { convertToPDF, isConverting, error: pdfError } = usePDFConverter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileUploadMutation = useFileUpload();
  const fileVerificationMutation = useFileVerification();

  const convertPDF = async (url: string) => {
    try {
      setLoading(true);
      const formattedBlocks = await extractTextFromPDF(url);
      setContent(formattedBlocks);
    } catch (err) {
      const errorMessage =
        "Failed to convert PDF. Please check the URL and try again.";
      onError?.(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUrl) {
      convertPDF(currentUrl);
    }
  }, [currentUrl]);

  useEffect(() => {
    if (pdfError) {
      onError?.(pdfError);
    }
  }, [pdfError, onError]);

  const handleUpload = async () => {
    try {
      const blob = await convertToPDF(content);
      if (blob == null) throw Error("Cannot upload pdf");

      const file = new File([blob], "converted.pdf", {
        type: "application/pdf",
      });
      const result = await fileUploadMutation.mutateAsync(file);

      await fileVerificationMutation.mutateAsync({
        uni_doc_uri: result.downloadUrl,
        doc_id: doc_id, // You might want to generate a unique ID here
        formatId: format_uri,
        uni_application_id: uni_application_id,
      });
    } catch (err) {
      console.error(err);
      onError?.("Failed to upload and verify the PDF.");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await fileUploadMutation.mutateAsync(file);
        setCurrentUrl(result.downloadUrl);
      } catch (err) {
        console.error(err);
        onError?.("Failed to upload the file.");
      }
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <EvaluatorMessages
        messages={currentUniDoc[0].messages}
        assigned_evaluator={currentUniDoc[0].assigned_evaluator}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">PDF Content</h2>
        <div className="flex space-x-2">
          {content.length > 0 && (
            <Button
              onClick={handleUpload}
              disabled={
                isConverting ||
                fileUploadMutation.isLoading ||
                fileVerificationMutation.isLoading
              }
            >
              {isConverting ||
              fileUploadMutation.isLoading ||
              fileVerificationMutation.isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="-ml-1 mr-2 h-4 w-4" />
                  Upload PDF
                </>
              )}
            </Button>
          )}
          <Button onClick={handleChooseFile}>
            <FileUp className="-ml-1 mr-2 h-4 w-4" />
            Choose from files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Converting PDF...</span>
        </div>
      ) : content.length > 0 ? (
        <MarkdownEditor content={content} onChange={setContent} />
      ) : null}
    </div>
  );
};

export default PDFMarkdownConverter;

import {} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface Message {
  id: number;
  content: string;
  timestamp: Date;
}

("use client");

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationDocument } from "@/schemas/applicationSchema";
import { timeStamp } from "console";

interface Message {
  id: number;
  content: string;
  timestamp: Date;
  category: "info" | "warning" | "success";
}

type ApprovalStatus = "approved" | "not approved" | "pending";

interface ApprovalStage {
  name: string;
  status: ApprovalStatus;
}

function EvaluatorMessages({ messages, assigned_evaluator }) {
  console.log("messages", messages);
  return (
    <Card className="w-full max-w-3xl mx-auto mb-16">
      <CardHeader>
        <CardTitle className="text-2xl">Evaluator Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="messages">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages">Evaluator Messages</TabsTrigger>
            <TabsTrigger value="status">Approval Status</TabsTrigger>
          </TabsList>
          <TabsContent value="messages">
            <ScrollArea className="h-[400px] w-full pr-4 mt-2">
              {messages == null ? (
                <div className="flex h-full justify-center">
                  <div className="self-center">No Updates from Evaluator</div>
                </div>
              ) : (
                [{id:1, timestamp:new Date().toString(), content:"Seems forged"}].map((message) => (
                  <div
                    key={message.message.id}
                    className="mb-4 last:mb-0 p-3 bg-muted rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-muted-foreground">
                        {message.message.timestamp}
                      </p>
                    </div>
                    <p>{message.message.content}</p>
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="status">
            <div className="mt-2">
              {assigned_evaluator.map((aev, index) => (
                <div
                  key={index}
                  className="mb-4 last:mb-0 p-3 bg-muted rounded-lg flex justify-between items-center"
                >
                  <span>{aev.check_type}</span>
                  <Badge
                    variant={
                      aev.status === "APPROVED"
                        ? "default"
                        : aev.status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {aev.status}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
