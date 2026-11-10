"use client";
// "Create photo wall" button. Clicking it shows a name box and a Create button.
import { useActionState, useState } from "react";
import { createWall, type CreateWallState } from "./wall-actions";

export default function CreateWallForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<CreateWallState, FormData>(createWall, { error: null });

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}>
        Create photo wall
      </button>
    );
  }
  return (
    <form action={formAction} className="form">
      <label>
        Wall name
        <input type="text" name="name" required maxLength={60} autoFocus />
      </label>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
