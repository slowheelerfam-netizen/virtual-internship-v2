"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Book } from "@/types/book";
import Image from "next/image";
import {
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import {
  BsFillPlayFill,
  BsFillPauseFill,
  BsFillSkipEndFill,
  BsFillSkipStartFill,
} from "react-icons/bs";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  // audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const rafRef = useRef<number>(0);

  // ── fetch book ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      });
  }, [id]);

  // ── audio setup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!book?.audioLink) return;

    const audio = new Audio(book.audioLink);
    audioRef.current = audio;
    setIsAudioLoading(true);

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      setIsAudioLoading(false);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
      cancelAnimationFrame(rafRef.current);
    };
  }, [book?.audioLink]);

  // RAF-based progress ticker
  const tick = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      cancelAnimationFrame(rafRef.current);
    } else {
      audio.play();
      rafRef.current = requestAnimationFrame(tick);
    }
    setIsPlaying((p) => !p);
  }, [isPlaying, tick]);

  const skip = useCallback((secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + secs, 0), audio.duration);
    setCurrentTime(audio.currentTime);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  }, []);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  // ── skeleton ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
        <div style={{ flex: 1, padding: "40px 48px", maxWidth: "680px", margin: "0 auto" }}>
          <div className="skeleton" style={{ height: "28px", width: "60%", marginBottom: "12px", borderRadius: "6px" }} />
          <div className="skeleton" style={{ height: "18px", width: "40%", marginBottom: "32px", borderRadius: "6px" }} />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "16px", width: "100%", marginBottom: "12px", borderRadius: "4px" }} />
          ))}
        </div>
        <div style={{ width: "280px", borderLeft: "1px solid #e1e7ea" }}>
          <div className="skeleton" style={{ height: "100%" }} />
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
      {/* ── summary panel ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 48px", maxWidth: "680px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#032b41", marginBottom: "8px" }}>
          {book.title}
        </h1>
        <p style={{ fontSize: "15px", color: "#394547", marginBottom: "32px" }}>{book.author}</p>

        <div
          style={{
            fontSize: "16px",
            color: "#032b41",
            lineHeight: 1.8,
            whiteSpace: "pre-line",
          }}
        >
          {book.summary}
        </div>
      </div>

      {/* ── right panel ── */}
      <aside
        style={{
          width: "280px",
          flexShrink: 0,
          borderLeft: "1px solid #e1e7ea",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "48px",
          gap: "12px",
        }}
      >
        <figure style={{ position: "relative", width: "180px", height: "180px" }}>
          {book.imageLink && (
            <Image src={book.imageLink} alt={book.title} fill sizes="180px" className="object-contain" />
          )}
        </figure>
        <p style={{ fontSize: "15px", fontWeight: 700, color: "#032b41", textAlign: "center", padding: "0 16px" }}>
          {book.title}
        </p>
        <p style={{ fontSize: "13px", color: "#394547", textAlign: "center" }}>{book.author}</p>
      </aside>

      {/* ── audio player bar (fixed bottom) ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "220px",
          right: 0,
          backgroundColor: "#032b41",
          padding: "12px 48px",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* book info row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <figure style={{ position: "relative", width: "40px", height: "40px", flexShrink: 0 }}>
            {book.imageLink && (
              <Image src={book.imageLink} alt={book.title} fill sizes="40px" className="object-contain" />
            )}
          </figure>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{book.title}</p>
            <p style={{ fontSize: "12px", color: "#bac8ce" }}>{book.author}</p>
          </div>
        </div>

        {/* controls row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* skip back */}
          <button onClick={() => skip(-10)} style={{ color: "#fff", fontSize: "28px", lineHeight: 1 }} title="Back 10s">
            <BsFillSkipStartFill />
          </button>

          {/* play / pause */}
          <button
            onClick={togglePlay}
            disabled={isAudioLoading}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              color: "#032b41",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              flexShrink: 0,
            }}
          >
            {isAudioLoading ? (
              <AiOutlineLoading3Quarters style={{ animation: "spin 1s linear infinite" }} />
            ) : isPlaying ? (
              <BsFillPauseFill />
            ) : (
              <BsFillPlayFill />
            )}
          </button>

          {/* skip forward */}
          <button onClick={() => skip(10)} style={{ color: "#fff", fontSize: "28px", lineHeight: 1 }} title="Forward 10s">
            <BsFillSkipEndFill />
          </button>

          {/* time / scrubber */}
          <span style={{ color: "#bac8ce", fontSize: "13px", minWidth: "36px" }}>
            {formatTime(currentTime)}
          </span>

          <div style={{ flex: 1, position: "relative", height: "4px" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "2px",
                backgroundColor: "#4a6274",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${progress}%`,
                borderRadius: "2px",
                backgroundColor: "#2bd97c",
                pointerEvents: "none",
              }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                opacity: 0,
                cursor: "pointer",
                height: "100%",
              }}
            />
          </div>

          <span style={{ color: "#bac8ce", fontSize: "13px", minWidth: "36px", textAlign: "right" }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* spin keyframe */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
