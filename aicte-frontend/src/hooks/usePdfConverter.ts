import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FormattedTextBlock } from '@/lib/pdfjs-setup';

interface UsePDFConverterReturn {
  convertToPDF: (content: FormattedTextBlock[]) => Promise<Blob | null>;
  isConverting: boolean;
  error: string | null;
}

export function usePDFConverter(): UsePDFConverterReturn {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToPDF = async (content: FormattedTextBlock[]): Promise<Blob | null> => {
    try {
      setIsConverting(true);
      setError(null);

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      let yPosition = 40;
      const margin = 40;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const usableWidth = pageWidth - 2 * margin;

      for (const block of content) {
        if (block.text === '\n---\n') {
          doc.addPage();
          yPosition = 40;
          continue;
        }

        const fontSize = parseInt(block.style.fontSize) * 0.75;
        doc.setFont(
          block.style.fontFamily === 'inherit' ? 'helvetica' : block.style.fontFamily,
          block.style.fontWeight === 'bold' ? 'bold' : 'normal'
        );
        doc.setFontSize(fontSize);

        const lines = doc.splitTextToSize(block.text, usableWidth);

        if (yPosition + lines.length * fontSize * 1.5 > pageHeight - margin) {
          doc.addPage();
          yPosition = 40;
        }

        lines.forEach((line: string) => {
          let xPosition = margin;
          if (block.style.textAlign === 'center') {
            xPosition = (pageWidth - doc.getTextWidth(line)) / 2;
          } else if (block.style.textAlign === 'right') {
            xPosition = pageWidth - margin - doc.getTextWidth(line);
          }

          doc.text(line, xPosition, yPosition);
          yPosition += fontSize * 1.5;
        });

        yPosition += fontSize * 0.5;
      }

      // Generate a Blob for the PDF
      const pdfBlob = doc.output('blob');
      return pdfBlob;
    } catch (err) {
      setError('Failed to convert content to PDF. Please try again.');
      console.error(err);
      return null;
    } finally {
      setIsConverting(false);
    }
  };

  return {
    convertToPDF,
    isConverting,
    error,
  };
}
