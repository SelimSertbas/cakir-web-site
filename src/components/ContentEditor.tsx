import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image as ImageIcon,
  Code
} from 'lucide-react';

interface ContentEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ initialValue = '', onChange }) => {
  const [content, setContent] = useState(initialValue);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

  useEffect(() => {
    onChange(content);
  }, [content, onChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSelection({
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    });
  };

  const formatText = (format: string) => {
    if (!selection) return;

    const { start, end } = selection;
    const selectedText = content.substring(start, end);
    let newContent = content;
    let newCursorPos = end;

    switch (format) {
      case 'bold':
        newContent = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newContent = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'underline':
        newContent = content.substring(0, start) + `__${selectedText}__` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'heading1':
        newContent = content.substring(0, start) + `# ${selectedText}` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'heading2':
        newContent = content.substring(0, start) + `## ${selectedText}` + content.substring(end);
        newCursorPos = end + 3;
        break;
      case 'heading3':
        newContent = content.substring(0, start) + `### ${selectedText}` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'bulletList':
        newContent = content.substring(0, start) + `- ${selectedText}` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'numberedList':
        newContent = content.substring(0, start) + `1. ${selectedText}` + content.substring(end);
        newCursorPos = end + 3;
        break;
      case 'quote':
        newContent = content.substring(0, start) + `> ${selectedText}` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'code':
        newContent = content.substring(0, start) + `\`${selectedText}\`` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'link':
        const url = prompt('Link URL:');
        if (url) {
          newContent = content.substring(0, start) + `[${selectedText}](${url})` + content.substring(end);
          newCursorPos = end + url.length + 4;
        }
        break;
      case 'image':
        const imageUrl = prompt('Resim URL:');
        if (imageUrl) {
          newContent = content.substring(0, start) + `![${selectedText}](${imageUrl})` + content.substring(end);
          newCursorPos = end + imageUrl.length + 5;
        }
        break;
    }

    setContent(newContent);
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="border border-coffee-200 rounded-lg overflow-hidden">
      <div className="bg-coffee-50 p-2 border-b border-coffee-200 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          className="hover:bg-coffee-100"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          className="hover:bg-coffee-100"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          className="hover:bg-coffee-100"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-coffee-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('heading1')}
          className="hover:bg-coffee-100"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('heading2')}
          className="hover:bg-coffee-100"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('heading3')}
          className="hover:bg-coffee-100"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-coffee-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bulletList')}
          className="hover:bg-coffee-100"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('numberedList')}
          className="hover:bg-coffee-100"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('quote')}
          className="hover:bg-coffee-100"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-coffee-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('link')}
          className="hover:bg-coffee-100"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('image')}
          className="hover:bg-coffee-100"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('code')}
          className="hover:bg-coffee-100"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={content}
        onChange={handleTextChange}
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setSelection({
            start: target.selectionStart,
            end: target.selectionEnd
          });
        }}
        className="min-h-[300px] p-4 font-mono text-sm border-0 focus-visible:ring-0"
        placeholder="İçeriğinizi buraya yazın..."
      />
    </div>
  );
};

export default ContentEditor; 