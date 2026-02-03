"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950">
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 p-2 bg-zinc-50 dark:bg-zinc-900">
        <button
          type="button"
          onClick={toggleBold}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('bold') ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500'}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('italic') ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500'}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        <button
          type="button"
          onClick={toggleBulletList}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500'}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('orderedList') ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500'}`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
        <button
          type="button"
          onClick={toggleBlockquote}
          className={`p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${editor.isActive('blockquote') ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-500'}`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <div className="flex-1"></div>
        <button
          type="button"
          onClick={undo}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 disabled:opacity-30"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 disabled:opacity-30"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
