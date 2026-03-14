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
          console.log("selected:", data);
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
    <div className="max-w-[1070px] w-full mx-auto px-6 py-10">

      {/* Selected just for you */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#032b41] mb-4">
          Selected just for you
        </h2>
        {selected && (
          <Link
            href={`/book/${selected.id}`}
            className="flex flex-col sm:flex-row gap-6 bg-[#fbe8c3] rounded-lg p-6 hover:opacity-90 transition-opacity"
          >
            <p className="text-[#394547] text-sm sm:hidden">{selected.subTitle}</p>
            <div className="hidden sm:block w-px bg-[#bac8ce] self-stretch" />

            {/* Left: subtitle + divider (desktop) */}
            <div className="hidden sm:flex flex-col justify-center flex-1">
              <p className="text-[#394547] text-base">{selected.subTitle}</p>
            </div>

            <div className="hidden sm:block w-px bg-[#bac8ce] self-stretch" />

            {/* Right: book info */}
            <div className="flex gap-4 flex-1">
              <figure className="relative shrink-0 w-[140px] h-[140px] overflow-hidden rounded">
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
              <div className="flex flex-col justify-center gap-2">
                <p className="text-[#032b41] font-bold text-base leading-tight">
                  {selected.title}
                </p>
                <p className="text-[#394547] text-sm">{selected.author}</p>
                <div className="flex items-center gap-4 text-[#032b41] text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <BiTime className="text-base" />
                    3 mins
                  </span>
                  <span className="flex items-center gap-1">
                    <BsStar className="text-base" />
                    {selected.averageRating}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* Recommended For You */}
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

      {/* Suggested Books */}
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
