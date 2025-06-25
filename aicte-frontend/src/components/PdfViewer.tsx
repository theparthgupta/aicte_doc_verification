import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  pdfPath: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col items-center w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <p className="text-lg font-semibold">Loading PDF...</p>
        </div>
      )}
      <iframe
        src={`${pdfPath}#toolbar=0&navpanes=0`}
        className="w-full h-full border rounded-lg"
        style={{ minHeight: '60vh' }}
        onLoad={() => setLoading(false)}
        title="PDF Viewer"
      />
    </div>
  );
};

