"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Book } from "@/types/book";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${debouncedQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [debouncedQuery]);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
      <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f1f6f4", borderRadius: "8px", padding: "0 12px", height: "40px", gap: "8px" }}>
        <AiOutlineSearch style={{ color: "#032b41", fontSize: "20px", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search for books"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ border: "none", background: "transparent", outline: "none", fontSize: "14px", color: "#032b41", width: "100%" }}
        />
      </div>

      {(results.length > 0 || loading) && query.trim() && (
        <div style={{ position: "absolute", top: "48px", left: 0, right: 0, backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 50, maxHeight: "400px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "16px", color: "#394547", fontSize: "14px" }}>Searching...</div>
          ) : (
            results.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                onClick={() => { setQuery(""); setResults([]); }}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderBottom: "1px solid #f1f6f4", textDecoration: "none" }}
              >
                <figure style={{ position: "relative", width: "40px", height: "40px", flexShrink: 0 }}>
                  {book.imageLink && (
                    <Image src={book.imageLink} alt={book.title} fill sizes="40px" className="object-contain" />
                  )}
                </figure>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#032b41" }}>{book.title}</p>
                  <p style={{ fontSize: "12px", color: "#394547" }}>{book.author}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}