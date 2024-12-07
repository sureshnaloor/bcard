'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'

import { FiBold, FiItalic, FiList, FiLink } from 'react-icons/fi';
import ColorSelector from './TipTap/ColorSelector';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onClose: () => void;
}

export default function RichTextEditor({ content, onChange, onClose }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rich Text Editor</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="flex gap-2 p-2 border-b bg-gray-50 dark:bg-gray-700">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            >
              <FiBold />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            >
              <FiItalic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            >
              <FiList />
            </button>
            <ColorSelector editor={editor} />
          </div>
          
          <EditorContent 
            editor={editor}
            className="p-4 min-h-[200px] prose dark:prose-invert max-w-none"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md dark:text-blue-400 dark:hover:bg-gray-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
} 