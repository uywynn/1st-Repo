"use client";
// A Delete button that asks "Delete this upload?" first.
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteUpload } from "./delete-actions";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm("Delete this upload?")) return;
    startTransition(async () => {
      const { error } = await deleteUpload(id);
      if (error) window.alert(error);
      router.refresh();
    });
  }

  return (
    <button type="button" className="delete" onClick={handleClick} disabled={pending}>
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
