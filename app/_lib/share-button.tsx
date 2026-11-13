"use client";
// Share button: on phones it opens the phone's share menu; on computers it copies the link.
import { useState } from "react";

export default function ShareButton({ code, name }: { code: string; name: string }) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    const url = `${window.location.origin}/w/${code}`;
    const isPhone = window.matchMedia("(pointer: coarse)").matches;
    if (isPhone && navigator.share) {
      try {
        await navigator.share({ title: name, text: `Add your photos to ${name}`, url });
      } catch {
        // The person closed the share menu; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied");
    } catch {
      setMessage(`Copy this link: ${url}`);
    }
  }

  return (
    <span className="share">
      <button type="button" onClick={handleClick}>
        Share
      </button>
      {message && <span role="status">{message}</span>}
    </span>
  );
}
