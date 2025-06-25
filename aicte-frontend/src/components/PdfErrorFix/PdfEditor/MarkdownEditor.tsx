import React from 'react';
import styled from 'styled-components';
import { FormattedTextBlock } from '@/lib/pdfjs-setup';

interface MarkdownEditorProps {
  content: FormattedTextBlock[];
  onChange: (content: FormattedTextBlock[]) => void;
}

const EditorContainer = styled.div`
  .mdxeditor {
    font-family: inherit;
    line-height: inherit;
  }
`;

const TextBlock = styled.div<{ style: FormattedTextBlock['style'] }>`
  ${props => ({
    ...props.style,
    margin: '0',
    padding: '0',
  })}
`;

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content, onChange }) => {
  return (
    <EditorContainer className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white p-6">
      <div className="prose max-w-none">
        {content.map((block, index) => (
          <TextBlock
            key={index}
            style={block.style}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const newContent = [...content];
              newContent[index] = {
                ...newContent[index],
                text: e.currentTarget.textContent || '',
              };
              onChange(newContent);
            }}
          >
            {block.text}
          </TextBlock>
        ))}
      </div>
    </EditorContainer>
  );
};