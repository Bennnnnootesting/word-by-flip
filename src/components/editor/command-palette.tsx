"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  Table,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Printer,
  Sun,
  Moon,
  Undo,
  Redo,
  Search,
  Eraser,
  FileDown,
  Type,
} from "lucide-react";

interface CommandPaletteProps {
  editor: Editor | null;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function CommandPalette({
  editor,
  isDark,
  onToggleTheme,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = useCallback(
    (fn: () => void) => {
      setOpen(false);
      fn();
    },
    []
  );

  if (!open) return null;

  return (
    <div cmdk-dialog="">
      <div cmdk-overlay="" onClick={() => setOpen(false)} />
      <Command
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <Command.Input placeholder="Type a command or search..." autoFocus />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Formatting">
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleBold().run()
                )
              }
            >
              <Bold />
              Bold
              <kbd>⌘B</kbd>
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleItalic().run()
                )
              }
            >
              <Italic />
              Italic
              <kbd>⌘I</kbd>
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleUnderline().run()
                )
              }
            >
              <Underline />
              Underline
              <kbd>⌘U</kbd>
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleStrike().run()
                )
              }
            >
              <Strikethrough />
              Strikethrough
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().unsetAllMarks().run()
                )
              }
            >
              <Eraser />
              Clear formatting
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Blocks">
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().setParagraph().run()
                )
              }
            >
              <Type />
              Paragraph
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().setHeading({ level: 1 }).run()
                )
              }
            >
              <Heading1 />
              Heading 1
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().setHeading({ level: 2 }).run()
                )
              }
            >
              <Heading2 />
              Heading 2
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().setHeading({ level: 3 }).run()
                )
              }
            >
              <Heading3 />
              Heading 3
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleBulletList().run()
                )
              }
            >
              <List />
              Bullet List
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleOrderedList().run()
                )
              }
            >
              <ListOrdered />
              Numbered List
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleTaskList().run()
                )
              }
            >
              <CheckSquare />
              Task List
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleBlockquote().run()
                )
              }
            >
              <Quote />
              Blockquote
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().toggleCodeBlock().run()
                )
              }
            >
              <Code />
              Code Block
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().setHorizontalRule().run()
                )
              }
            >
              <Minus />
              Divider
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor
                    ?.chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                )
              }
            >
              <Table />
              Table
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Alignment">
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().setTextAlign("left").run()
                )
              }
            >
              <AlignLeft />
              Align Left
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().setTextAlign("center").run()
                )
              }
            >
              <AlignCenter />
              Align Center
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() =>
                  editor?.chain().focus().setTextAlign("right").run()
                )
              }
            >
              <AlignRight />
              Align Right
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Actions">
            <Command.Item
              onSelect={() =>
                runCommand(() => editor?.chain().focus().undo().run())
              }
            >
              <Undo />
              Undo
              <kbd>⌘Z</kbd>
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() => editor?.chain().focus().redo().run())
              }
            >
              <Redo />
              Redo
              <kbd>⇧⌘Z</kbd>
            </Command.Item>
            <Command.Item
              onSelect={() => runCommand(() => window.print())}
            >
              <Printer />
              Print Document
              <kbd>⌘P</kbd>
            </Command.Item>
            <Command.Item onSelect={() => runCommand(onToggleTheme)}>
              {isDark ? <Sun /> : <Moon />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </Command.Item>
            <Command.Item
              onSelect={() =>
                runCommand(() => {
                  const text = editor?.getText() || "";
                  const blob = new Blob([text], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "document.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                })
              }
            >
              <FileDown />
              Export as Text
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
