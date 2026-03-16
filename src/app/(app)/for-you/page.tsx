"use client";

import { useEffect, useState, useRef } from "react";
import { Book } from "@/types/book";
import BookCard from "@/components/BookCard";
import ForYouSkeleton from "@/components/ForYouSkeleton";
import { BsStar, BsPlayCircleFill } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";

function formatDurationWords(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m} mins ${s} secs`;
}

export default function ForYouPage() {
  const [selected, setSelected] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected").then((r) => r.json()),
      fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended").then((r) => r.json()),
      fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested").then((r) => r.json()),
    ])
      .then(([sel, rec, sug]) => {
        setSelected(Array.isArray(sel) ? sel[0] : sel);
        setRecommended(rec);
        setSuggested(sug);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected?.audioLink) return;
    const audio = new Audio(selected.audioLink);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => {
      setSelectedDuration(formatDurationWords(audio.duration));
    });
    return () => { audio.src = ""; };
  }, [selected?.audioLink]);

  if (loading) return <ForYouSkeleton />;

  return (
    <div className="app-page">

      {/* Selected Book */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>
          Selected just for you
        </h2>
        {selected && (
          <Link
            href={`/book/${selected.id}`}
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#FBEFD6",
              borderRadius: "8px",
              textDecoration: "none",
              overflow: "hidden",
              maxWidth: "900px",


            }}
          >
            {/* Left: subtitle */}
            <div style={{ flex: 1, padding: "24px 32px", display: "flex", alignItems: "center", borderRight: "1px solid #bac8ce" }}>
              <p style={{ fontSize: "18px", color: "#394547", lineHeight: 1.6 }}>
                {selected.subTitle}
              </p>
            </div>

            {/* Divider — full height, no margin */}
            

            {/* Right: image + play button + meta */}
            <div style={{ flexShrink: 0, padding: "24px 32px", display: "flex", gap: "16px", alignItems: "center" }}>
              <figure style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
                {selected.imageLink && (
                  <Image
                    src={selected.imageLink}
                    alt={selected.title}
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                )}
              </figure>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#032b41" }}>{selected.title}</p>
                <p style={{ fontSize: "14px", color: "#394547" }}>{selected.author}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#032b41" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#032b41",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <BsPlayCircleFill style={{ color: "#fff", fontSize: "18px" }} />
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <BiTime /> {selectedDuration ?? "..."}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <BsStar /> {selected.averageRating}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* Recommended Books */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>
          Recommended For You
        </h2>
        <p style={{ fontSize: "16px", color: "#394547", fontWeight: 300, marginBottom: "24px" }}>
          We think you&apos;ll like these
        </p>
        <div style={{ display: "flex", flexWrap: "nowrap", gap: "48px", overflowX: "auto", paddingBottom: "24px", scrollbarWidth: "thin" }}>
          {recommended.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Suggested Books */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>
          Suggested Books
        </h2>
        <p style={{ fontSize: "16px", color: "#394547", fontWeight: 300, marginBottom: "24px" }}>
          Browse these books
        </p>
        <div style={{ display: "flex", flexWrap: "nowrap", gap: "48px", overflowX: "auto", paddingBottom: "24px", scrollbarWidth: "thin" }}>
          {suggested.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

    </div>
  );
}