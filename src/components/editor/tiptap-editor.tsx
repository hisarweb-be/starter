"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import { useEffect } from "react"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Minus, Heading1, Heading2, Heading3,
  Undo2, Redo2
} from "lucide-react"
import { cn } from "@/lib/utils"

type TipTapEditorProps = {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

export function TipTapEditor({ content, onChange, placeholder = "Schrijf hier je tekst...", className }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
  })

  // Sync content when it changes from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const toolbarButton = (
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    title: string
  ) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded transition-colors",
        active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
    </button>
  )

  return (
    <div className={cn("rounded-lg border border-input bg-background", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-2">
        {/* Headings */}
        {toolbarButton(
          editor.isActive("heading", { level: 1 }),
          () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          <Heading1 className="h-3.5 w-3.5" />,
          "Kop 1"
        )}
        {toolbarButton(
          editor.isActive("heading", { level: 2 }),
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          <Heading2 className="h-3.5 w-3.5" />,
          "Kop 2"
        )}
        {toolbarButton(
          editor.isActive("heading", { level: 3 }),
          () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          <Heading3 className="h-3.5 w-3.5" />,
          "Kop 3"
        )}

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Formatting */}
        {toolbarButton(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="h-3.5 w-3.5" />, "Vet (Ctrl+B)")}
        {toolbarButton(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-3.5 w-3.5" />, "Cursief (Ctrl+I)")}
        {toolbarButton(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="h-3.5 w-3.5" />, "Onderstreept")}
        {toolbarButton(editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), <Strikethrough className="h-3.5 w-3.5" />, "Doorgestreept")}

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Lists */}
        {toolbarButton(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="h-3.5 w-3.5" />, "Opsomming")}
        {toolbarButton(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-3.5 w-3.5" />, "Genummerde lijst")}
        {toolbarButton(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="h-3.5 w-3.5" />, "Citaat")}

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Horizontal rule */}
        {toolbarButton(false, () => editor.chain().focus().setHorizontalRule().run(), <Minus className="h-3.5 w-3.5" />, "Horizontale lijn")}

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Undo/Redo */}
        {toolbarButton(false, () => editor.chain().focus().undo().run(), <Undo2 className="h-3.5 w-3.5" />, "Ongedaan maken")}
        {toolbarButton(false, () => editor.chain().focus().redo().run(), <Redo2 className="h-3.5 w-3.5" />, "Opnieuw")}
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  )
}
