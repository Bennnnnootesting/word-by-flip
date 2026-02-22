"use client";

import dynamic from "next/dynamic";

const PrintLayoutEditor = dynamic(
  () => import("@/components/editor/print-layout-editor"),
  { ssr: false }
);

export default function Home() {
  return <PrintLayoutEditor />;
}
