import React, { useEffect, useState, Suspense } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = React.lazy(() => import('react-quill').then(module => {
  return { default: module.default };
}));

interface ContentEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ]
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block',
  'link', 'image', 'align', 'color', 'background'
];

const ContentEditor: React.FC<ContentEditorProps> = ({ initialValue = '', onChange }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  // SSR'da null döndür
  if (typeof window === 'undefined') return null;

  return (
    <div className="border border-coffee-200 rounded-lg overflow-hidden bg-white dark:bg-coffee-50">
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          placeholder="İçeriğinizi buraya yazın..."
          style={{ minHeight: 300 }}
        />
      </Suspense>
    </div>
  );
};

export default ContentEditor; 