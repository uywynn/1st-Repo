// One upload in a grid: the photo or video, an optional label, and its Delete button.
import DeleteButton from "./delete-button";

type Props = { id: string; kind: string; url: string; label?: string };

export default function UploadTile({ id, kind, url, label }: Props) {
  return (
    <li>
      {kind === "video" ? (
        <video src={url} controls preload="metadata" playsInline />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Uploaded photo" loading="lazy" />
      )}
      {label && <span className="tile-label">{label}</span>}
      <DeleteButton id={id} />
    </li>
  );
}
