'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useEffect } from 'react'
import {
  Bold, Italic, List, ListOrdered,
  Heading2, Heading3, Quote, Minus, Undo, Redo
} from 'lucide-react'

interface RichTextEditorProps {
  name?: string
  defaultValue?: string
  placeholder?: string
}

export default function RichTextEditor({
  name = 'description',
  defaultValue = '',
  placeholder = 'Nhập mô tả sản phẩm...',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[180px] focus:outline-none px-4 py-3 text-sm text-dark',
      },
    },
  })

  const html = editor?.getHTML() ?? ''

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
      {/* Hidden input for Server Action */}
      <input type="hidden" name={name} value={html === '<p></p>' ? '' : html} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-soft-gray/50">
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}>
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}>
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })}>
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })}>
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>
          <List className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')}>
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')}>
          <Quote className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>
          <Undo className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>
          <Redo className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <div className="ml-auto text-[11px] text-gray-400 font-medium pr-1">
          {editor?.storage.characterCount.characters() ?? 0} ký tự
        </div>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarBtn({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-md transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'text-gray-500 hover:bg-gray-200 hover:text-dark'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}
