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
      .then((data) => setSelected(data));

    fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended")
      .then((res) => res.json())
      .then((data) => setRecommended(data));

    fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested")
      .then((res) => res.json())
      .then((data) => setSuggested(data));
  }, []);

  return (
    <div className="for-you__wrapper">
      <section className="for-you__section">
        <div className="for-you__title">Selected just for you</div>
        {selected && (
          <Link href={`/book/${selected.id}`} className="selected__book">
            <div className="selected__book--subtitle">{selected.subTitle}</div>
            <div className="selected__book--line" />
            <div className="selected__book--content">
              <figure className="selected__book--image-mask">
                {selected.imageLink && (
                  <Image
                    src={selected.imageLink}
                    alt={selected.title}
                    width={140}
                    height={140}
                  />
                )}
              </figure>
              <div className="selected__book--details">
                <div className="selected__book--title">{selected.title}</div>
                <div className="selected__book--author">{selected.author}</div>
                <div className="selected__book--info">
                  <div className="selected__book--info-item">
                    <BiTime />
                    <span>3 mins</span>
                  </div>
                  <div className="selected__book--info-item">
                    <BsStar />
                    <span>{selected.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      <section className="for-you__section">
        <div className="for-you__title">Recommended For You</div>
        <div className="for-you__subtitle">We think you&apos;ll like these</div>
        <div className="books__wrapper">
          {recommended.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="for-you__section">
        <div className="for-you__title">Suggested Books</div>
        <div className="for-you__subtitle">Browse these books</div>
        <div className="books__wrapper">
          {suggested.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}