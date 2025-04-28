// FormattingToolbar.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
} from "@tabler/icons-react";

interface FormattingToolbarProps {
  contentRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  noteContent: string;
  onContentChange: (newContent: string) => void;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ 
  contentRef, 
  noteContent, 
  onContentChange 
}) => {
  // Active state for formatting buttons
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    list: false,
    numberedList: false
  });

  // Improved check if cursor is within formatted text
  const checkActiveFormats = useCallback(() => {
    if (!contentRef.current) return;

    const cursorPos = contentRef.current.selectionStart;
    const cursorEnd = contentRef.current.selectionEnd;
    const currentContent = noteContent;
    
    // Check if current cursor position is in a line that starts with list markers
    const lineStart = currentContent.lastIndexOf('\n', cursorPos - 1) + 1;
    const lineEnd = currentContent.indexOf('\n', cursorPos);
    const currentLine = currentContent.substring(
      lineStart,
      lineEnd === -1 ? currentContent.length : lineEnd
    );
    
    // Check for bullet list
    const isBulletList = /^\s*-\s/.test(currentLine);
    
    // Check for numbered list
    const isNumberedList = /^\s*\d+\.\s/.test(currentLine);
    
    // For bold and italic, analyze the entire document structure
    const formatMap = analyzeFormatting(currentContent);
    
    // Check if cursor position falls within any bold or italic regions
    const isBold = isFormatActive(formatMap.boldRegions, cursorPos, cursorEnd);
    const isItalic = isFormatActive(formatMap.italicRegions, cursorPos, cursorEnd);
    
    setActiveFormats({
      bold: isBold,
      italic: isItalic,
      list: isBulletList,
      numberedList: isNumberedList
    });
  }, [contentRef, noteContent]);
  
  // More robust formatting analysis
  const analyzeFormatting = (text: string) => {
    // Find all occurrences of bold and italic formatting
    const boldRegions: Array<[number, number]> = [];
    const italicRegions: Array<[number, number]> = [];
    
    // Find bold regions (text between ** pairs)
    let boldStartIdx = -1;
    let inBold = false;
    
    // Find italic regions (text between * pairs, but not part of **)
    let italicStartIdx = -1;
    let inItalic = false;
    
    for (let i = 0; i < text.length; i++) {
      // Check for bold markers **
      if (i < text.length - 1 && text[i] === '*' && text[i + 1] === '*') {
        if (!inBold) {
          boldStartIdx = i;
          inBold = true;
        } else {
          // End of bold section
          boldRegions.push([boldStartIdx + 2, i]); // +2 to skip the ** markers
          inBold = false;
        }
        i++; // Skip the second *
        continue;
      }
      
      // Check for italic markers * (but not part of **)
      if (text[i] === '*' && (i === 0 || text[i - 1] !== '*') && 
          (i === text.length - 1 || text[i + 1] !== '*')) {
        if (!inItalic) {
          italicStartIdx = i;
          inItalic = true;
        } else {
          // End of italic section
          italicRegions.push([italicStartIdx + 1, i]); // +1 to skip the * marker
          inItalic = false;
        }
      }
    }
    
    return {
      boldRegions,
      italicRegions
    };
  };
  
  // Check if cursor or selection overlaps with formatted regions
  const isFormatActive = (
    regions: Array<[number, number]>,
    cursorStart: number,
    cursorEnd: number
  ): boolean => {
    // No selection case - check if cursor is within any region
    if (cursorStart === cursorEnd) {
      return regions.some(([start, end]) => 
        cursorStart > start && cursorStart <= end
      );
    }
    
    // Selection case - check if selection overlaps with any region
    return regions.some(([start, end]) => 
      (cursorStart >= start && cursorStart < end) ||
      (cursorEnd > start && cursorEnd <= end) ||
      (cursorStart <= start && cursorEnd >= end)
    );
  };

  // Monitor cursor position changes in real-time
  useEffect(() => {
    const currentRef = contentRef.current;
    const handleSelectionChange = () => {
      checkActiveFormats();
    };
    
    // More comprehensive event listeners for real-time updates
    if (currentRef) {
      // These events cover most cursor movements and text changes
      currentRef.addEventListener('click', handleSelectionChange);
      currentRef.addEventListener('keyup', handleSelectionChange);
      currentRef.addEventListener('mouseup', handleSelectionChange);
      currentRef.addEventListener('touchend', handleSelectionChange);
      currentRef.addEventListener('input', handleSelectionChange);
      
      // For drag selection, we need to listen to mouse events
      const mouseDownHandler = () => {
        const mouseMoveHandler = () => {
          handleSelectionChange();
        };
        
        // Add mousemove listener when mouse is down
        document.addEventListener('mousemove', mouseMoveHandler);
        
        // Remove the mousemove listener when mouse is up
        const mouseUpHandler = () => {
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        };
        
        document.addEventListener('mouseup', mouseUpHandler);
      };
      
      currentRef.addEventListener('mousedown', mouseDownHandler);
    }
    
    // Add document-level selection change event
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('click', handleSelectionChange);
        currentRef.removeEventListener('keyup', handleSelectionChange);
        currentRef.removeEventListener('mouseup', handleSelectionChange);
        currentRef.removeEventListener('touchend', handleSelectionChange);
        currentRef.removeEventListener('input', handleSelectionChange);
      }
      
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [checkActiveFormats, contentRef]);

  // Initial check when component mounts and when note content changes
  useEffect(() => {
    checkActiveFormats();
  }, [noteContent, checkActiveFormats]);

  // Improved insert/remove formatting at cursor position
  const insertFormatting = (format: string) => {
    // Ensure contentRef.current is not null
    if (!contentRef.current) {
      console.warn('Content textarea reference is not available');
      return;
    }
    
    const cursorPos = contentRef.current.selectionStart;
    const cursorEnd = contentRef.current.selectionEnd;
    const currentContent = noteContent;
    const selectedText = currentContent.substring(cursorPos, cursorEnd);
    
    let newContent = '';
    let newCursorPos = 0;
    
    // Get the formatting structure for better decision making
    const formatMap = analyzeFormatting(currentContent);
    
    switch (format) {
      case 'bold':
        if (activeFormats.bold) {
          // Find which bold region contains our selection or cursor
          const activeRegion = formatMap.boldRegions.find(([start, end]) => 
            (cursorPos === cursorEnd && cursorPos > start && cursorPos <= end) || // Cursor inside region
            (cursorPos !== cursorEnd && ((cursorPos >= start && cursorPos < end) || 
                                        (cursorEnd > start && cursorEnd <= end) ||
                                        (cursorPos <= start && cursorEnd >= end)))  // Selection overlaps region
          );
          
          if (activeRegion) {
            // Extract the region boundaries
            const [regionStart, regionEnd] = activeRegion;
            
            // Find the actual markers in the text (2 characters before regionStart and after regionEnd)
            const markerStartPos = regionStart - 2;
            const markerEndPos = regionEnd;
            
            // Remove the ** markers while keeping the content
            newContent = 
              currentContent.substring(0, markerStartPos) + 
              currentContent.substring(regionStart, regionEnd) + 
              currentContent.substring(markerEndPos + 2);
            
            // Adjust cursor position
            if (cursorPos > regionStart) {
              newCursorPos = Math.max(cursorPos - 2, markerStartPos);
            } else {
              newCursorPos = cursorPos;
            }
            
            if (cursorEnd > regionEnd) {
              // Selection extends beyond the bold region
              newCursorPos = cursorEnd - 4; // Adjust for the two ** markers removed
            }
          } else {
            // Fallback: wrap with bold markers
            newContent = currentContent.substring(0, cursorPos) + `**${selectedText}**` + currentContent.substring(cursorEnd);
            newCursorPos = cursorPos + 2 + selectedText.length;
          }
        } else {
          // Not bold, add bold formatting
          newContent = currentContent.substring(0, cursorPos) + `**${selectedText}**` + currentContent.substring(cursorEnd);
          newCursorPos = cursorPos + 2 + selectedText.length;
        }
        break;
        
      case 'italic':
        if (activeFormats.italic) {
          // Find which italic region contains our selection or cursor
          const activeRegion = formatMap.italicRegions.find(([start, end]) => 
            (cursorPos === cursorEnd && cursorPos > start && cursorPos <= end) || // Cursor inside region
            (cursorPos !== cursorEnd && ((cursorPos >= start && cursorPos < end) || 
                                        (cursorEnd > start && cursorEnd <= end) ||
                                        (cursorPos <= start && cursorEnd >= end)))  // Selection overlaps region
          );
          
          if (activeRegion) {
            // Extract the region boundaries
            const [regionStart, regionEnd] = activeRegion;
            
            // Find the actual markers in the text
            const markerStartPos = regionStart - 1; // Italic uses single *
            const markerEndPos = regionEnd;
            
            // Remove the * markers while keeping the content
            newContent = 
              currentContent.substring(0, markerStartPos) + 
              currentContent.substring(regionStart, regionEnd) + 
              currentContent.substring(markerEndPos + 1);
            
            // Adjust cursor position
            if (cursorPos > regionStart) {
              newCursorPos = Math.max(cursorPos - 1, markerStartPos);
            } else {
              newCursorPos = cursorPos;
            }
            
            if (cursorEnd > regionEnd) {
              // Selection extends beyond the italic region
              newCursorPos = cursorEnd - 2; // Adjust for the two * markers removed
            }
          } else {
            // Fallback: wrap with italic markers
            newContent = currentContent.substring(0, cursorPos) + `*${selectedText}*` + currentContent.substring(cursorEnd);
            newCursorPos = cursorPos + 1 + selectedText.length;
          }
        } else {
          // Not italic, add italic formatting
          newContent = currentContent.substring(0, cursorPos) + `*${selectedText}*` + currentContent.substring(cursorEnd);
          newCursorPos = cursorPos + 1 + selectedText.length;
        }
        break;
  // Rest of implementation for InsertFormatting
      case 'list':
        // Handle multi-line text for lists
        if (selectedText.includes('\n')) {
          const lines = selectedText.split('\n');
          const bulletedLines = lines.map(line => `- ${line}`).join('\n');
          newContent = currentContent.substring(0, cursorPos) + bulletedLines + currentContent.substring(cursorEnd);
          newCursorPos = cursorPos + bulletedLines.length;
        } else {
          newContent = currentContent.substring(0, cursorPos) + `\n- ${selectedText}` + currentContent.substring(cursorEnd);
          newCursorPos = cursorPos + 3 + selectedText.length;
        }
        break;
      case 'numbered-list':
        // Handle multi-line text for numbered lists
        if (selectedText.includes('\n')) {
          const lines = selectedText.split('\n');
          const numberedLines = lines.map((line, i) => `${i+1}. ${line}`).join('\n');
          newContent = currentContent.substring(0, cursorPos) + numberedLines + currentContent.substring(cursorEnd);
          newCursorPos = cursorPos + numberedLines.length;
        } else {
          newContent = currentContent.substring(0, cursorPos) + `\n1. ${selectedText}` + currentContent.substring(cursorEnd);
          newCursorPos = cursorPos + 4 + selectedText.length;
        }
        break;
      case 'line-break':
        // Add a paragraph break (double line break) at cursor position
        newContent = currentContent.substring(0, cursorPos) + '\n\n' + currentContent.substring(cursorEnd);
        newCursorPos = cursorPos + 2;
        break;
      default:
        return;
    }
    
    onContentChange(newContent);
    
    // Set cursor position after update
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        contentRef.current.setSelectionRange(newCursorPos, newCursorPos);
        // Update active formats after the change
        checkActiveFormats();
      }
    }, 0);
  };

  return (
    <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1">
        <button 
          onClick={() => insertFormatting('bold')}
          className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-200 text-zinc-700 ${
            activeFormats.bold ? 'bg-amber-200 text-amber-800' : ''
          }`}
          title="Bold"
        >
          <IconBold className="w-4 h-4" />
        </button>
        <button 
          onClick={() => insertFormatting('italic')}
          className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-200 text-zinc-700 ${
            activeFormats.italic ? 'bg-amber-200 text-amber-800' : ''
          }`}
          title="Italic"
        >
          <IconItalic className="w-4 h-4" />
        </button>
        <button 
          onClick={() => insertFormatting('list')}
          className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-200 text-zinc-700 ${
            activeFormats.list ? 'bg-amber-200 text-amber-800' : ''
          }`}
          title="Bullet List"
        >
          <IconList className="w-4 h-4" />
        </button>
        <button 
          onClick={() => insertFormatting('numbered-list')}
          className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-200 text-zinc-700 ${
            activeFormats.numberedList ? 'bg-amber-200 text-amber-800' : ''
          }`}
          title="Numbered List"
        >
          <IconListNumbers className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-xs text-zinc-500">
        <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">Ctrl+S</kbd> to save or <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">Esc</kbd> to cancel</span>
      </div>
    </div>
  );
};