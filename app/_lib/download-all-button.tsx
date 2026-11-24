"use client";
// "Download all photos": fetches every photo and video on a wall in the browser,
// packs them into one .zip file (with the fflate package), and saves it.
// Done in the browser because Vercel limits how big and how long a server request can be.
import { useState } from "react";
import { zipSync } from "fflate";

export type DownloadItem = { url: string; extension: string };

// File names can't contain these characters on some computers.
function safeName(name: string) {
  return name.replace(/[\\/:*?"<>|]/g, "-").trim() || "photo-wall";
}

export default function DownloadAllButton({ wallName, items }: { wallName: string; items: DownloadItem[] }) {
  const [status, setStatus] = useState<"idle" | "busy">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setMessage(null);
    if (items.length === 0) {
      setMessage("Nothing to download yet");
      return;
    }
    setStatus("busy");
    try {
      const files: Record<string, Uint8Array> = {};
      for (let i = 0; i < items.length; i++) {
        setMessage(`Preparing ${i + 1} of ${items.length}…`);
        const response = await fetch(items[i].url);
        if (!response.ok) throw new Error(`file ${i + 1} could not be downloaded`);
        const number = String(i + 1).padStart(3, "0");
        files[`${number}.${items[i].extension}`] = new Uint8Array(await response.arrayBuffer());
      }
      // level 0 = no squeezing: photos and videos are already compressed, so this is fastest.
      const zipped = zipSync(files, { level: 0 });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([zipped as BlobPart], { type: "application/zip" }));
      link.download = `${safeName(wallName)}.zip`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 60_000);
      setMessage(`Saved ${items.length} files as ${link.download}`);
    } catch (error) {
      setMessage(`Download failed: ${error instanceof Error ? error.message : "please try again"}.`);
    } finally {
      setStatus("idle");
    }
  }

  return (
    <p className="download-all">
      <button type="button" onClick={handleClick} disabled={status === "busy"}>
        {status === "busy" ? "Preparing…" : "Download all photos"}
      </button>
      {message && <span role="status">{message}</span>}
    </p>
  );
}
