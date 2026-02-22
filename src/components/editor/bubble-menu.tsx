"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Link,
} from "lucide-react";

interface EditorBubbleMenuProps {
  editor: Editor;
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenu = useCallback(() => {
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      setIsVisible(false);
      return;
    }

    const { view } = editor;
    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    const editorRect = view.dom.getBoundingClientRect();
    const menuWidth = 240; // approximate menu width

    const left = Math.max(
      editorRect.left,
      Math.min(
        (start.left + end.left) / 2 - menuWidth / 2,
        editorRect.right - menuWidth
      )
    );

    setPosition({
      top: start.top - 48,
      left,
    });
    setIsVisible(true);
  }, [editor]);

  useEffect(() => {
    editor.on("selectionUpdate", updateMenu);
    editor.on("blur", () => {
      // Delay hiding so clicks on menu buttons register
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
        }
      }, 200);
    });

    return () => {
      editor.off("selectionUpdate", updateMenu);
    };
  }, [editor, updateMenu]);

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="bubble-menu"
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 50,
      }}
    >
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={editor.isActive("bold") ? "is-active" : ""}
        title="Bold (⌘B)"
      >
        <Bold size={15} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={editor.isActive("italic") ? "is-active" : ""}
        title="Italic (⌘I)"
      >
        <Italic size={15} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={editor.isActive("underline") ? "is-active" : ""}
        title="Underline (⌘U)"
      >
        <Underline size={15} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={editor.isActive("strike") ? "is-active" : ""}
        title="Strikethrough"
      >
        <Strikethrough size={15} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCode().run();
        }}
        className={editor.isActive("code") ? "is-active" : ""}
        title="Inline Code"
      >
        <Code size={15} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHighlight().run();
        }}
        className={editor.isActive("highlight") ? "is-active" : ""}
        title="Highlight"
      >
        <Highlighter size={15} />
      </button>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleLink();
        }}
        className={editor.isActive("link") ? "is-active" : ""}
        title="Link"
      >
        <Link size={15} />
      </button>
    </div>
  );
}
