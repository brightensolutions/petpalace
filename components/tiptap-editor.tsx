"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image"; // Import the Image extension
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Redo,
  Undo,
  ImageIcon,
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image, // Add the Image extension
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[150px] border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL"); // In a real app, this would be an upload component
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b">
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          size="icon"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          size="icon"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          variant={
            editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
          }
          size="icon"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          variant={
            editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
          }
          size="icon"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          variant={
            editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
          }
          size="icon"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="icon"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="icon"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          size="icon"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          size="icon"
          variant="ghost"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button type="button" onClick={addImage} size="icon" variant="ghost">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          size="icon"
          variant="ghost"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          size="icon"
          variant="ghost"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
