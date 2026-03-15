"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import BookCard from "@/components/BookCard";
import ForYouSkeleton from "@/components/ForYouSkeleton";
import { BsStar } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";

export default function ForYouPage() {
  const [selected, setSelected] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            {/* Left: subtitle */}
            <div style={{ flex: 1, padding: "24px", display: "flex", alignItems: "center" }}>
              <p style={{ fontSize: "16px", color: "#394547", lineHeight: 1.5 }}>
                {selected.subTitle}
              </p>
            </div>

            {/* Divider */}
            <div style={{ width: "1px", backgroundColor: "#bac8ce", margin: "16px 0" }} />

            {/* Right: image + meta */}
            <div style={{ flexShrink: 0, padding: "24px", display: "flex", gap: "16px", alignItems: "center" }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#032b41" }}>{selected.title}</p>
                <p style={{ fontSize: "12px", color: "#394547" }}>{selected.author}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "#032b41" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <BiTime /> 3 mins
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
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>
          Recommended For You
        </h2>
        <p style={{ fontSize: "14px", color: "#394547", marginBottom: "16px" }}>
          We think you&apos;ll like these
        </p>
        <div style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "12px",
          scrollbarWidth: "thin",
        }}>
          {recommended.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Suggested Books */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>
          Suggested Books
        </h2>
        <p style={{ fontSize: "14px", color: "#394547", marginBottom: "16px" }}>
          Browse these books
        </p>
        <div style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "12px",
          scrollbarWidth: "thin",
        }}>
          {suggested.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

    </div>
  );
}