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
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#032b41" }}>
          Selected just for you
        </h2>
        {selected && (
          <Link
            href={`/book/${selected.id}`}
            style={{ backgroundColor: "#FBEFD6", borderRadius: "8px", textDecoration: "none" }}
            className="flex flex-col md:flex-row gap-6 p-4 md:p-6 items-start md:items-center"
          >
            {/* Subtitle — left on desktop, top on mobile */}
            <div className="flex items-center md:flex-1">
              <p style={{ fontSize: "16px", color: "#394547" }}>{selected.subTitle}</p>
            </div>

            {/* Divider — hidden on mobile */}
            <div
              className="hidden md:block self-stretch"
              style={{ width: "1px", backgroundColor: "#bac8ce" }}
            />

            {/* Book details — right on desktop, below subtitle on mobile */}
            <div className="flex gap-4 items-center md:flex-1">
              <figure style={{ position: "relative", width: "140px", height: "140px", flexShrink: 0 }}>
                {selected.imageLink && (
                  <Image
                    src={selected.imageLink}
                    alt={selected.title}
                    fill
                    sizes="140px"
                    className="object-contain"
                  />
                )}
              </figure>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#032b41" }}>{selected.title}</p>
                <p style={{ fontSize: "14px", color: "#394547" }}>{selected.author}</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    fontSize: "14px",
                    color: "#032b41",
                  }}
                >
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
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#032b41" }}>
          Recommended For You
        </h2>
        <p className="text-sm mb-4" style={{ color: "#394547" }}>
          We think you&apos;ll like these
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommended.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Suggested Books */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#032b41" }}>
          Suggested Books
        </h2>
        <p className="text-sm mb-4" style={{ color: "#394547" }}>
          Browse these books
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {suggested.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
