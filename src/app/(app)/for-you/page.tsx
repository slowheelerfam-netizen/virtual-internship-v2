"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import BookCard from "@/components/BookCard";
import { BsStar } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";

export default function ForYouPage() {
  const [selected, setSelected] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);

  useEffect(() => {
    fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected")
      .then((res) => res.json())
      .then((data) => {
        setSelected(Array.isArray(data) ? data[0] : data);
      });

    fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended")
      .then((res) => res.json())
      .then((data) => setRecommended(data));

    fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested")
      .then((res) => res.json())
      .then((data) => setSuggested(data));
  }, []);

  return (
    <div style={{ maxWidth: "1070px", width: "100%", padding: "40px 48px" }}>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#032b41] mb-4">
          Selected just for you
        </h2>
        {selected && (
            <Link
              href={`/book/${selected.id}`}
              style={{ display: "flex", gap: "24px", backgroundColor: "#FBEFD6", borderRadius: "8px", padding: "24px", textDecoration: "none", alignItems: "center" }}
            >
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <p style={{ fontSize: "16px", color: "#394547" }}>{selected.subTitle}</p>
              </div>
              <div style={{ width: "1px", backgroundColor: "#bac8ce", alignSelf: "stretch" }} />
              <div style={{ display: "flex", gap: "16px", alignItems: "center", flex: 1 }}>
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
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", color: "#032b41" }}>
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

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#032b41] mb-1">
          Recommended For You
        </h2>
        <p className="text-[#394547] text-sm mb-4">We think you&apos;ll like these</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recommended.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#032b41] mb-1">
          Suggested Books
        </h2>
        <p className="text-[#394547] text-sm mb-4">Browse these books</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {suggested.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}