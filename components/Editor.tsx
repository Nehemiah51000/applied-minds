/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  // Redo,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Link as LinkIcon,
  ImageIcon,
  Table as TableIcon,
  // PlusSquare,
  Trash2,
  ChevronDown,
  ChevronRight,
  MinusSquare,
  Palette,
  Highlighter,
  Minus,
  CheckSquare,
  Eraser,
  Code,
} from 'lucide-react';
import { useCallback } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (content: string) => void;
  limit?: number; // Optional limit
}

const RichEditor = ({ value, onChange, limit = 50000 }: RichEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5] },
        bulletList: { keepAttributes: true, keepMarks: true },
        orderedList: { keepAttributes: true, keepMarks: true },
        codeBlock: {
          HTMLAttributes: {
            class:
              'bg-slate-800 text-white p-4 rounded-md my-4 font-mono text-sm',
          },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
      Image.extend({
        // This allows the editor to recognize and save width/height styles
        addAttributes() {
          return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            width: {
              default: 'auto',
              renderHTML: (attributes) => ({ width: attributes.width }),
            },
            height: {
              default: 'auto',
              renderHTML: (attributes) => ({ height: attributes.height }),
            },
          };
        },
      }).configure({
        allowBase64: true,
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount.configure({
        limit,
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base focus:outline-none min-h-[300px] p-5 max-w-none tiptap-editor',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    const url = window.prompt('URL');
    if (url) (editor as any).chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          const result = e.target?.result as string;
          (editor as any).chain().focus().setImage({ src: result }).run();
        };

        reader.readAsDataURL(file);
      }
    };

    input.click();
  }, [editor]);

  if (!editor) return null;

  const MenuButton = ({
    onClick,
    isActive = false,
    children,
    title,
    danger = false,
  }: any) => (
    <button
      type='button'
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? 'bg-sky-100 text-sky-700'
          : danger
            ? 'text-red-500 hover:bg-red-50'
            : 'text-slate-600 hover:bg-slate-100'
      }`}>
      {children}
    </button>
  );

  return (
    <div className='w-full border rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-200'>
      {/* TOOLBAR */}
      <div className='flex flex-wrap items-center gap-x-0.5 gap-y-1 p-2 border-b bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm'>
        <MenuButton
          onClick={() => (editor as any).chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title='Bold'>
          <Bold size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => (editor as any).chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title='Italic'>
          <Italic size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleHighlight().run()
          }
          isActive={editor.isActive('highlight')}
          title='Highlight'>
          <Highlighter size={18} />
        </MenuButton>

        <div className='flex items-center gap-1 px-2 border-l border-r border-slate-200'>
          <Palette size={16} className='text-slate-400' />
          <input
            type='color'
            onInput={(event: any) =>
              (editor as any).chain().focus().setColor(event.target.value).run()
            }
            value={editor.getAttributes('textStyle').color || '#000000'}
            className='w-6 h-6 cursor-pointer bg-transparent border-none'
            title='Text Color'
          />
        </div>

        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive('heading', { level: 1 })}
          title='H1'>
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive('heading', { level: 2 })}
          title='H2'>
          <Heading2 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive('heading', { level: 3 })}
          title='H3'>
          <Heading3 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleHeading({ level: 4 }).run()
          }
          isActive={editor.isActive('heading', { level: 4 })}
          title='H4'>
          <Heading4 size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleHeading({ level: 5 }).run()
          }
          isActive={editor.isActive('heading', { level: 5 })}
          title='H5'>
          <Heading5 size={18} />
        </MenuButton>

        <div className='w-px h-6 bg-slate-200 mx-1' />

        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleBulletList().run()
          }
          isActive={editor.isActive('bulletList')}
          title='Bullet List'>
          <List size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleOrderedList().run()
          }
          isActive={editor.isActive('orderedList')}
          title='Ordered List'>
          <ListOrdered size={18} />
        </MenuButton>
        <MenuButton
          onClick={() => (editor as any).chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title='Task List'>
          <CheckSquare size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleBlockquote().run()
          }
          isActive={editor.isActive('blockquote')}
          title='Quote'>
          <Quote size={18} />
        </MenuButton>

        <div className='w-px h-6 bg-slate-200 mx-1' />

        <MenuButton
          onClick={addLink}
          isActive={editor.isActive('link')}
          title='Add Link'>
          <LinkIcon size={18} />
        </MenuButton>
        <MenuButton onClick={addImage} title='Add Image'>
          <ImageIcon size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().setHorizontalRule().run()
          }
          title='Horizontal Line'>
          <Minus size={18} />
        </MenuButton>

        <div className='w-px h-6 bg-slate-200 mx-1' />

        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().toggleCodeBlock().run()
          }
          isActive={editor.isActive('codeBlock')}
          title='Code Block'>
          <Code size={18} />
        </MenuButton>
        <MenuButton
          onClick={() =>
            (editor as any).chain().focus().unsetAllMarks().clearNodes().run()
          }
          title='Clear Formatting'>
          <Eraser size={18} />
        </MenuButton>

        <div className='w-px h-6 bg-slate-200 mx-1' />

        <MenuButton
          onClick={() =>
            (editor as any)
              .chain()
              .focus()
              .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
              .run()
          }
          title='Insert Table'>
          <TableIcon size={18} />
        </MenuButton>

        {editor.isActive('table') && (
          <div className='flex items-center gap-0.5 bg-sky-50 rounded-lg px-1 animate-in fade-in slide-in-from-top-1'>
            <MenuButton
              onClick={() =>
                (editor as any).chain().focus().addColumnAfter().run()
              }
              title='Add Col'>
              <ChevronRight size={18} />
            </MenuButton>
            <MenuButton
              onClick={() =>
                (editor as any).chain().focus().deleteColumn().run()
              }
              title='Del Col'
              danger>
              <MinusSquare size={18} className='rotate-90' />
            </MenuButton>
            <MenuButton
              onClick={() =>
                (editor as any).chain().focus().addRowAfter().run()
              }
              title='Add Row'>
              <ChevronDown size={18} />
            </MenuButton>
            <MenuButton
              onClick={() => (editor as any).chain().focus().deleteRow().run()}
              title='Del Row'
              danger>
              <MinusSquare size={18} />
            </MenuButton>
            <MenuButton
              onClick={() =>
                (editor as any).chain().focus().deleteTable().run()
              }
              title='Delete Table'
              danger>
              <Trash2 size={18} />
            </MenuButton>
          </div>
        )}

        <div className='ml-auto flex gap-1'>
          <MenuButton
            onClick={() => (editor as any).chain().focus().undo().run()}
            title='Undo'>
            <Undo size={18} />
          </MenuButton>
          <MenuButton
            onClick={() => (editor as any).chain().focus().redo().run()}
            title='Redo'>
            <Undo size={18} className='scale-x-[-1]' />
          </MenuButton>
        </div>
      </div>

      <style>{`
       .tiptap-editor h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
       .tiptap-editor h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; }
       .tiptap-editor h3 { font-size: 1.25rem; font-weight: 600; }
       .tiptap-editor h4 { font-size: 1.1rem; font-weight: 600; }
       .tiptap-editor h5 { font-size: 1rem; font-weight: 600; font-style: italic; }
       .tiptap-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin: 1rem 0 !important; }
       .tiptap-editor ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 1rem 0 !important; }
       .tiptap-editor table { border-collapse: collapse; width: 100%; border: 1px solid #ddd; margin: 1rem 0; }
       .tiptap-editor td, .tiptap-editor th { border: 1px solid #ddd; padding: 8px; min-width: 50px; }
       .tiptap-editor th { background-color: #f8fafc; text-align: left; font-weight: bold; }
       .tiptap-editor a { color: #0ea5e9; text-decoration: underline; }
       
       /* IMAGE INTERACTION STYLING */
       .tiptap-editor img { 
         max-width: 100%; 
         height: auto; 
         border-radius: 0.5rem; 
         display: inline-block; 
         margin: 1rem 0;
         cursor: move; /* Move cursor as requested */
         transition: all 0.2s ease;
       }

       /* Visual indicator that the image is selected */
       .tiptap-editor img.ProseMirror-selectednode {
         outline: 3px solid #0ea5e9;
         box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
       }

       .tiptap-editor ul[data-type="taskList"] { list-style: none !important; padding: 0 !important; }
       .tiptap-editor ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; }
       .tiptap-editor blockquote { border-left: 4px solid #e2e8f0; padding-left: 1rem; font-style: italic; color: #64748b; margin: 1.5rem 0; }
       .tiptap-editor hr { border: none; border-top: 2px solid #e2e8f0; margin: 2rem 0; }
     `}</style>

      <div className='relative grow overflow-y-auto'>
        <EditorContent editor={editor} />
      </div>

      <div className='flex items-center justify-between px-4 py-2 border-t bg-slate-50 text-[12px] text-slate-500 font-medium'>
        <div className='flex gap-4'>
          <span>{editor.storage.characterCount.words()} words</span>
          <span>{editor.storage.characterCount.characters()} characters</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-24 h-2 bg-slate-200 rounded-full overflow-hidden'>
            <div
              className={`h-full transition-all ${editor.storage.characterCount.characters() > limit * 0.9 ? 'bg-amber-500' : 'bg-sky-500'}`}
              style={{
                width: `${(editor.storage.characterCount.characters() / limit) * 100}%`,
              }}
            />
          </div>
          <span>
            {Math.round(
              (editor.storage.characterCount.characters() / limit) * 100,
            )}
            %
          </span>
        </div>
      </div>
    </div>
  );
};

export default RichEditor;
