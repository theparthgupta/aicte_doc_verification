import React from 'react';
import { FileText, Github } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">PDF to Markdown</h1>
              <p className="text-sm text-gray-500">Convert and edit PDF content easily</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700"
          >
            <Github className="h-6 w-6" />
          </a>
        </div>
      </div>
    </header>
  );
};