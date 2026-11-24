"use client";
// "Leave this wall" button, for people who joined a wall (not its creator).
import { useTransition } from "react";
import { leaveWall } from "./wall-actions";

export default function LeaveWallButton({ wallId }: { wallId: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm("Leave this wall? Your photos stay on it.")) return;
    startTransition(async () => {
      const result = await leaveWall(wallId);
      if (result?.error) window.alert(result.error);
    });
  }

  return (
    <button type="button" className="leave" onClick={handleClick} disabled={pending}>
      {pending ? "Leaving…" : "Leave this wall"}
    </button>
  );
}
