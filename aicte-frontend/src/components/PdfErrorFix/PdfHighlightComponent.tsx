import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { pdfjsLib } from "@/lib/pdfjs-setup";
import { PdfHighlight } from "./PdfPopover";
import { useToast } from "@/hooks/use-toast";
import PreviousUploadsDialog from "./PreviousUploads";

export interface ErrorHighlight {
  content: {
    text: string;
  };
  position: {
    boundingRect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      width: number;
      height: number;
      pageNumber: number;
    };
    rects: any[];
    pageNumber: number;
  };
  comment: string;
  id: string;
}

export interface PdfViewerProps {
  url: string;
  errors: ErrorHighlight[];
}

export const ErrorViewer: React.FC<PdfViewerProps> = ({ url, errors }) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(2.5);
  const [highlights, setHighlights] = useState<ErrorHighlight[]>(errors);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [url]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);

        const containerWidth = containerRef.current.clientWidth - 32;
        const viewport = page.getViewport({ scale: 1.0 });
        const scaleFactor = containerWidth / viewport.width;
        const finalScale = scaleFactor * (window.devicePixelRatio || 1);

        const scaledViewport = page.getViewport({ scale: finalScale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { alpha: false });

        if (!context) return;

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${
          (containerWidth * scaledViewport.height) / scaledViewport.width
        }px`;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
          enableWebGL: true,
          renderInteractiveForms: true,
        };

        await page.render(renderContext).promise;
        setScale(scaleFactor);
      } catch (error) {
        console.error("Error rendering PDF page:", error);
      }
    };

    renderPage();

    const handleResize = () => {
      renderPage();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pdfDoc, currentPage]);

  const handleTextChange = (highlightId: string, newText: string) => {
    setHighlights((prevHighlights) =>
      prevHighlights.map((highlight) =>
        highlight.id === highlightId
          ? { ...highlight, content: { ...highlight.content, text: newText } }
          : highlight
      )
    );

    toast({
      title: "Text updated",
      description: "Your changes have been saved.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentHighlights =
    highlights?.filter(
      (highlight) => highlight.position.pageNumber === currentPage
    ) ?? [];
  console.log("currentHighlights", currentHighlights);
  return (
    <div className="flex min-h-screen p-4">
      <Card className="w-full max-w-4xl h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="mr-2" />
            PDF Viewer
          </CardTitle>
          <div className="flex items-center space-x-4">
            <PreviousUploadsDialog
              uploads={[
                {
                  id: "1",
                  fileName: "document1.pdf",
                  uploadDate: "2023-06-01",
                  layoutErrors: 3,
                  placeholderErrors: 2,
                  pdfUrl: "https://example.com/document1.pdf",
                },
                {
                  id: "2",
                  fileName: "document2.pdf",
                  uploadDate: "2023-06-05",
                  layoutErrors: 0,
                  placeholderErrors: 1,
                  pdfUrl: "https://example.com/document2.pdf",
                },
                {
                  id: "3",
                  fileName: "document3.pdf",
                  uploadDate: "2023-06-10",
                  layoutErrors: 5,
                  placeholderErrors: 0,
                  pdfUrl: "https://example.com/document3.pdf",
                },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="w-full bg-white rounded-lg shadow-lg">
              <div ref={containerRef} className="relative p-4">
                <canvas ref={canvasRef} className="w-full h-auto" />
                <div className="absolute top-0 left-0 w-full h-full">
                  {currentHighlights.map((highlight) => (
                    <PdfHighlight
                      key={highlight.id}
                      x={highlight.position.boundingRect.x1 * scale}
                      y={highlight.position.boundingRect.y1 * scale}
                      width={highlight.position.boundingRect.width * scale}
                      height={highlight.position.boundingRect.height * scale}
                      text={highlight.content.text}
                      comment={highlight.comment}
                      onTextChange={(newText) =>
                        handleTextChange(highlight.id, newText)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {numPages}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
