import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export {pdfjsLib}

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  dir: string;
  fontName?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
}

interface TextContent {
  items: TextItem[];
  styles?: {
    [key: string]: {
      fontFamily?: string;
      ascent?: number;
      descent?: number;
      vertical?: boolean;
    };
  };
}

export interface FormattedTextBlock {
  text: string;
  style: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string | number;
    lineHeight: string;
    marginBottom: string;
    textAlign: string;
    whiteSpace: string;
  };
}

function getFontInfo(item: TextItem, styles: TextContent['styles']) {
  const fontStyle = styles?.[item.fontName || ''] || {};
  const fontSize = Math.abs(item.transform[3]) || Math.abs(item.transform[0]);
  
  // Detect if font name contains bold or heavy
  const isBold = item.fontName?.toLowerCase().includes('bold') || 
                 item.fontName?.toLowerCase().includes('heavy');
  
  return {
    fontFamily: fontStyle.fontFamily || 'Arial',
    fontSize: `${fontSize}px`,
    fontWeight: isBold ? 'bold' : 'normal'
  };
}

export async function extractTextFromPDF(url: string): Promise<FormattedTextBlock[]> {
  const pdf = await pdfjsLib.getDocument(url).promise;
  const textBlocks: FormattedTextBlock[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent() as TextContent;
    
    // Sort items by their vertical position first, then horizontal
    const items = textContent.items.sort((a, b) => {
      const yDiff = b.transform[5] - a.transform[5];
      if (Math.abs(yDiff) < 2) {
        return a.transform[4] - b.transform[4];
      }
      return yDiff;
    });

    let currentY = items[0]?.transform[5];
    let currentBlock: TextItem[] = [];
    let currentStyle = {
      fontFamily: '',
      fontSize: '',
      fontWeight: '',
    };
    
    for (const item of items as TextItem[]) {
      const fontInfo = getFontInfo(item, textContent.styles);
      
      // Check if we're on a new line or have a style change
      if (
        Math.abs(currentY - item.transform[5]) > 2 ||
        currentStyle.fontFamily !== fontInfo.fontFamily ||
        currentStyle.fontSize !== fontInfo.fontSize ||
        currentStyle.fontWeight !== fontInfo.fontWeight
      ) {
        if (currentBlock.length > 0) {
          textBlocks.push({
            text: currentBlock.map(item => item.str).join(' '),
            style: {
              fontFamily: currentStyle.fontFamily,
              fontSize: currentStyle.fontSize,
              fontWeight: currentStyle.fontWeight,
              lineHeight: '1.5',
              marginBottom: '0.5em',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
            },
          });
        }
        
        currentBlock = [];
        currentY = item.transform[5];
        currentStyle = fontInfo;
      }
      
      currentBlock.push(item);
    }
    
    // Add the last block of the page
    if (currentBlock.length > 0) {
      textBlocks.push({
        text: currentBlock.map(item => item.str).join(' '),
        style: {
          fontFamily: currentStyle.fontFamily,
          fontSize: currentStyle.fontSize,
          fontWeight: currentStyle.fontWeight,
          lineHeight: '1.5',
          marginBottom: '0.5em',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
        },
      });
    }
    
    // Add page break if not the last page
    if (i < pdf.numPages) {
      textBlocks.push({
        text: '\n---\n',
        style: {
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'normal',
          lineHeight: '2',
          marginBottom: '1em',
          textAlign: 'center',
          whiteSpace: 'pre',
        },
      });
    }
  }
  
  return textBlocks;
}