"use client";
// The full-screen wall: photos and videos fall down a dark screen.
// Every few seconds it asks Supabase for new uploads; each new one is shown
// large in the middle first, then joins the falling collection.
import { useCallback, useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "../_lib/supabase-browser";

export type WallItem = { id: string; kind: string; url: string };
type Falling = { key: number; item: WallItem; left: number };

const ITEM_WIDTH = 160; // px, must match .falling in globals.css
const SPAWN_EVERY_MS = 700; // how often a new item starts falling
const CHECK_EVERY_MS = 4000; // how often to look for new uploads

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Media({ item }: { item: WallItem }) {
  return item.kind === "video" ? (
    <video src={item.url} autoPlay muted loop playsInline />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.url} alt="" />
  );
}

export default function Wall({ initialItems, since }: { initialItems: WallItem[]; since: string }) {
  const pool = useRef<WallItem[]>(initialItems); // everything that can fall
  const order = useRef<WallItem[]>([]); // the shuffled turn order for this round
  const seen = useRef(new Set(initialItems.map((i) => i.id)));
  const nextKey = useRef(0);
  const [falling, setFalling] = useState<Falling[]>([]);
  const [spotlight, setSpotlight] = useState<WallItem | null>(null);
  const spotlightRef = useRef<WallItem | null>(null);
  const waiting = useRef<WallItem[]>([]); // new uploads waiting for the spotlight
  const [isEmpty, setIsEmpty] = useState(initialItems.length === 0);

  // Show the next waiting upload in the middle (or nothing, if none are waiting).
  const showNext = useCallback(() => {
    const next = waiting.current.shift() ?? null;
    spotlightRef.current = next;
    setSpotlight(next);
  }, []);

  const drop = useCallback((item: WallItem) => {
    const maxLeft = Math.max(0, window.innerWidth - ITEM_WIDTH);
    const left = Math.random() * maxLeft;
    setFalling((f) => [...f, { key: nextKey.current++, item, left }]);
  }, []);

  // Start one item falling every SPAWN_EVERY_MS, going through everything in a random order.
  useEffect(() => {
    const timer = setInterval(() => {
      if (pool.current.length === 0) return;
      if (order.current.length === 0) order.current = shuffle(pool.current);
      drop(order.current.shift()!);
    }, SPAWN_EVERY_MS);
    return () => clearInterval(timer);
  }, [drop]);

  // Look for new uploads every CHECK_EVERY_MS.
  useEffect(() => {
    const supabase = createBrowserSupabase();
    let cursor = since;
    const timer = setInterval(async () => {
      const { data, error } = await supabase
        .from("uploads")
        .select("id, path, kind, created_at")
        .gt("created_at", cursor)
        .order("created_at", { ascending: true });
      if (error || !data) return; // try again next time
      for (const row of data) {
        cursor = row.created_at;
        if (seen.current.has(row.id)) continue;
        seen.current.add(row.id);
        waiting.current.push({
          id: row.id,
          kind: row.kind,
          url: supabase.storage.from("uploads").getPublicUrl(row.path).data.publicUrl,
        });
      }
      if (!spotlightRef.current) showNext();
    }, CHECK_EVERY_MS);
    return () => clearInterval(timer);
  }, [since, showNext]);

  // When the spotlight finishes: add the item to the falling pool, drop it now, show the next one.
  function spotlightDone() {
    if (spotlight) {
      pool.current = [...pool.current, spotlight];
      setIsEmpty(false);
      drop(spotlight);
    }
    showNext();
  }

  return (
    <div className="wall">
      {isEmpty && !spotlight && <p className="wall-empty">No photos yet. Upload one to start the wall.</p>}
      {falling.map((f) => (
        <div
          key={f.key}
          className="falling"
          style={{ left: f.left }}
          onAnimationEnd={() => setFalling((all) => all.filter((x) => x.key !== f.key))}
        >
          <Media item={f.item} />
        </div>
      ))}
      {spotlight && (
        <div key={spotlight.id} className="spotlight" onAnimationEnd={spotlightDone}>
          <Media item={spotlight} />
        </div>
      )}
    </div>
  );
}
