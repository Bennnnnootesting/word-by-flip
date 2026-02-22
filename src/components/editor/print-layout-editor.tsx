"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExt from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Table as TableExt } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table";
import { TableHeader } from "@tiptap/extension-table";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-text-style";

import EditorBubbleMenu from "./bubble-menu";
import CommandPalette from "./command-palette";
import SlashCommands from "./slash-commands";
import { useState, useEffect, useCallback } from "react";
import { FileText, User, Moon, Sun, Command } from "lucide-react";

export default function PrintLayoutEditor() {
  const [title, setTitle] = useState("Untitled Document");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start typing, or press / for commands…",
      }),
      UnderlineExt,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ multicolor: true }),
      Typography,
      TableExt.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      ImageExt.configure({ inline: false }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextStyle,
      Color,
      FontFamily,
      SlashCommands,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
    },
    immediatelyRender: false,
  });

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  // Keyboard shortcuts for print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        // Let browser handle print
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* ── Top Bar (Chromeless) ── */}
      <header className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
        style={{ background: "var(--background)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <FileText size={16} />
          </div>
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingTitle(false);
              }}
              autoFocus
              className="text-sm font-medium bg-transparent border-none outline-none"
              style={{ color: "var(--foreground)", width: "300px" }}
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground)" }}
            >
              {title}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Word count */}
          <span
            className="text-xs px-2 py-1 rounded"
            style={{ color: "var(--muted)" }}
          >
            {wordCount} words · {charCount} chars
          </span>

          {/* Cmd+K hint */}
          <button
            onClick={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                })
              );
            }}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-colors"
            style={{
              color: "var(--muted)",
              border: "1px solid var(--border)",
            }}
            title="Command Palette"
          >
            <Command size={12} />
            <span>K</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-md transition-colors hover:opacity-70"
            style={{ color: "var(--muted)" }}
            title="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User avatar */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{
              background: "var(--accent)",
              color: "white",
            }}
          >
            <User size={14} />
          </div>
        </div>
      </header>

      {/* ── Stage (Gray Background) ── */}
      <main className="pt-16 pb-16 px-4">
        {/* ── A4 Paper ── */}
        <div className="a4-page tiptap-editor">
          {editor && <EditorBubbleMenu editor={editor} />}
          <EditorContent editor={editor} />
        </div>
      </main>

      {/* ── Status Bar ── */}
      <footer
        className="no-print fixed bottom-0 left-0 right-0 flex items-center justify-between px-5 py-2 text-xs"
        style={{
          background: "var(--background)",
          color: "var(--muted)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-4">
          <span>A4 · 210 × 297 mm</span>
          <span>·</span>
          <span>Page 1</span>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Press{" "}
            <kbd
              className="px-1.5 py-0.5 rounded text-[10px]"
              style={{
                background: "rgba(0,0,0,.06)",
                border: "1px solid var(--border)",
              }}
            >
              /
            </kbd>{" "}
            for commands
          </span>
          <span>·</span>
          <span>
            <kbd
              className="px-1.5 py-0.5 rounded text-[10px]"
              style={{
                background: "rgba(0,0,0,.06)",
                border: "1px solid var(--border)",
              }}
            >
              ⌘K
            </kbd>{" "}
            palette
          </span>
        </div>
      </footer>

      {/* ── Command Palette ── */}
      <CommandPalette
        editor={editor}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}
