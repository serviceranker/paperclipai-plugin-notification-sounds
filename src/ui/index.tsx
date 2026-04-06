import { usePluginData } from "@paperclipai/plugin-sdk/ui";
import type { PluginGlobalToolbarButtonProps } from "@paperclipai/plugin-sdk/ui";
import { useEffect, useRef, useState, useCallback } from "react";
import { GLASS_SOUND_URI } from "./glass-sound.js";
import type { SoundEvent } from "../types.js";

const MUTE_KEY = "paperclip-notification-sound-muted";
const POLL_MS = 800;

export function NotificationListener({
  context,
}: PluginGlobalToolbarButtonProps) {
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem(MUTE_KEY) === "true"; }
    catch { return false; }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTimestamp = useRef("");
  const [tick, setTick] = useState(0);

  const { data } = usePluginData<{ events: SoundEvent[] }>(
    "recent-events", { _t: tick }
  );

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), POLL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(GLASS_SOUND_URI);
      audioRef.current.volume = 0.7;
    }
  }, []);

  const playSound = useCallback(() => {
    if (muted || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, [muted]);

  useEffect(() => {
    const events = data?.events;
    if (!events || events.length === 0) return;

    const last = events[events.length - 1];
    if (last.timestamp === lastTimestamp.current) return;

    if (lastTimestamp.current !== "") {
      const status = (last.detail as any)?.payload?.status ?? "";
      const id = (last.detail as any)?.payload?.identifier ?? "";
      const actor = (last.detail as any)?.actorType ?? "";
      console.log(`[NotificationSound] ${id} → ${status} (${actor})`);
      playSound();
    }
    lastTimestamp.current = last.timestamp;
  }, [data, playSound]);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    try { localStorage.setItem(MUTE_KEY, String(next)); } catch {}
  };

  return (
    <button
      onClick={toggle}
      title={muted ? "Unmute notifications" : "Mute notifications"}
      aria-label={muted ? "Unmute notifications" : "Mute notifications"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        fontSize: 13,
        color: muted ? "var(--color-text-tertiary, #888)" : "var(--color-text-primary, #333)",
        opacity: muted ? 0.6 : 1,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {muted ? (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </button>
  );
}
