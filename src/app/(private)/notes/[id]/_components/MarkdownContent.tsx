import React from "react";

interface MarkdownContentProps {
  content: string;
}

interface TextSegment {
  text: string;
  bold: boolean;
  italic: boolean;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Function to render a markdown paragraph
  const renderMarkdownParagraph = (paragraph: string): React.ReactNode => {
    // Empty paragraphs should render as line breaks
    if (paragraph.trim() === '') {
      return <br />;
    }
    
    // 1. Handle bullet lists
    if (paragraph.trim().startsWith('- ')) {
      const items = paragraph.split('\n').filter(line => line.trim().startsWith('- '));
      return (
        <ul className="list-disc pl-5 my-2">
          {items.map((item, index) => (
            <li key={index}>{renderInlineMarkdown(item.substring(2))}</li>
          ))}
        </ul>
      );
    }
    
    // 3. Handle single line breaks within paragraphs
    if (paragraph.includes('\n')) {
      return (
        <p className="mb-4 last:mb-0 text-zinc-800 leading-relaxed">
          {paragraph.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {renderInlineMarkdown(line)}
            </React.Fragment>
          ))}
        </p>
      );
    }
    
    // 4. Regular paragraph with inline formatting
    return (
      <p className="mb-4 last:mb-0 text-zinc-800 leading-relaxed">
        {renderInlineMarkdown(paragraph)}
      </p>
    );
  };
  
  // Function to handle inline markdown (bold, italic)
  const renderInlineMarkdown = (text: string): React.ReactNode[] => {
    if (!text) return [<span key="empty"></span>];
    
    // Split by markdown markers and keep the markers in the results
    const segments: TextSegment[] = [];
    let currentText = '';
    let inBold = false;
    let inItalic = false;
    
    for (let i = 0; i < text.length; i++) {
      // Handle bold markers **
      if (text[i] === '*' && i+1 < text.length && text[i+1] === '*') {
        segments.push({ 
          text: currentText,
          bold: inBold,
          italic: inItalic
        });
        currentText = '';
        inBold = !inBold;
        i++; // Skip the second *
        continue;
      }
      
      // Handle italic markers *
      if (text[i] === '*' && (i+1 >= text.length || text[i+1] !== '*')) {
        segments.push({ 
          text: currentText,
          bold: inBold,
          italic: inItalic
        });
        currentText = '';
        inItalic = !inItalic;
        continue;
      }
      
      currentText += text[i];
    }
    
    // Add the last segment
    if (currentText) {
      segments.push({ 
        text: currentText,
        bold: inBold, 
        italic: inItalic
      });
    }
    
    // Render segments with appropriate styling
    return segments.map((segment, index) => {
      if (!segment.text) return null;
      
      if (segment.bold && segment.italic) {
        return <strong key={index}><em>{segment.text}</em></strong>;
      } else if (segment.bold) {
        return <strong key={index}>{segment.text}</strong>;
      } else if (segment.italic) {
        return <em key={index}>{segment.text}</em>;
      } else {
        return <span key={index}>{segment.text}</span>;
      }
    }).filter((node): node is React.ReactElement => node !== null);
  };
  
  // Split content by double line breaks to identify paragraphs
  const paragraphs = content.split('\n');
  
  return (
    <div className="prose max-w-none w-full">
      {paragraphs.map((para, index) => (
        <div key={index} className="w-full">
          {renderMarkdownParagraph(para)}
        </div>
      ))}
    </div>
  );
};