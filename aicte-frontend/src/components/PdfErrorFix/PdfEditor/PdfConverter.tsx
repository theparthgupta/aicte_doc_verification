import React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { FileText, Upload } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFConverterProps {
  onTextExtracted: (text: string) => void;
}

export const PDFConverter: React.FC<PDFConverterProps> = ({ onTextExtracted }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const extractTextFromPDF = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const pdf = await pdfjsLib.getDocument(url).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      // Convert text to markdown format
      const markdownText = fullText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n\n');

      onTextExtracted(markdownText);
    } catch (err) {
      setError('Failed to extract text from PDF. Please check the URL and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('pdfUrl') as string;
    if (url) {
      await extractTextFromPDF(url);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="pdfUrl" className="text-sm font-medium text-gray-700">
            PDF URL
          </label>
          <div className="relative">
            <input
              type="url"
              name="pdfUrl"
              id="pdfUrl"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 pr-3 py-2"
              placeholder="https://example.com/document.pdf"
              required
            />
            <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            'Converting...'
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Convert PDF
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
};