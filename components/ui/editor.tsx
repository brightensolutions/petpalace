"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Editor({
  content,
  onChange,
  placeholder,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      Link,
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "max-w-full rounded-md my-3",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing your blog...",
      }),
    ],
    content,
    immediatelyRender: false, // ✅ prevents hydration error
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md p-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b pb-2 mb-2">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic")
              ? "bg-orange-500 text-white"
              : "bg-gray-200"
          }`}
        >
          I
        </button>

        {/* Headings */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 1 })
              ? "bg-orange-500 text-white"
              : "bg-gray-200"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-2 py-1 rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-orange-500 text-white"
              : "bg-gray-200"
          }`}
        >
          H2
        </button>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList")
              ? "bg-orange-500 text-white"
              : "bg-gray-200"
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("orderedList")
              ? "bg-orange-500 text-white"
              : "bg-gray-200"
          }`}
        >
          1. List
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className="px-2 py-1 rounded bg-gray-200"
        >
          Link
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="px-2 py-1 rounded bg-gray-200"
        >
          🖼️ Image
        </button>
      </div>

      {/* Content area */}
      <EditorContent
        editor={editor}
        className="min-h-[200px] prose max-w-none focus:outline-none"
      />
    </div>
  );
}
