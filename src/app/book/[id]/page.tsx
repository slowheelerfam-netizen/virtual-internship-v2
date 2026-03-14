"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Book } from "@/types/book";
import Image from "next/image";
import { BsBookmark, BsStar } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { AiOutlineAudio, AiOutlineBulb } from "react-icons/ai";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/modalSlice";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { LuBookOpenText } from "react-icons/lu";

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data));
  }, [id]);

  const handleReadListen = () => {
    if (!user) {
      dispatch(openModal("login"));
      return;
    }
    if (book?.subscriptionRequired) {
      router.push("/choose-plan");
      return;
    }
    router.push(`/player/${id}`);
  };

  const handleLibrary = () => {
    if (!user) {
      dispatch(openModal("login"));
      return;
    }
  };

  if (!book) {
    return (
      <div style={{ padding: "48px", fontSize: "18px", color: "#032b41" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#032b41", marginBottom: "8px" }}>
            {book.title}
          </h1>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "8px" }}>
            {book.author}
          </p>
          <p style={{ fontSize: "18px", fontWeight: 400, color: "#394547", marginBottom: "24px" }}>
            {book.subTitle}
          </p>

          <div style={{ borderTop: "1px solid #e1e7ea", borderBottom: "1px solid #e1e7ea", padding: "16px 0", marginBottom: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="flex items-center gap-2" style={{ fontSize: "16px", fontWeight: 500, color: "#032b41" }}>
              <BsStar style={{ flexShrink: 0 }} />
              <span>{book.averageRating} ({book.totalRating} ratings)</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: "16px", fontWeight: 500, color: "#032b41" }}>
              <BiTime style={{ flexShrink: 0 }} />
              <span>3 mins</span>
            </div>
           <div className="flex items-center gap-2" style={{ fontSize: "16px", fontWeight: 500, color: "#032b41" }}>
              <AiOutlineAudio style={{ flexShrink: 0 }} />
              <span>{book.type}</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: "16px", fontWeight: 500, color: "#032b41" }}>
              <AiOutlineBulb style={{ flexShrink: 0 }} />
              <span>{book.keyIdeas} Key ideas</span>
            </div>
          </div>

          <div className="flex gap-4" style={{ marginBottom: "16px" }}>
            <button onClick={handleReadListen} className="btn-primary">
              <LuBookOpenText size={20} /> Read
            </button>
            <button onClick={handleReadListen} className="btn-primary">
              <AiOutlineAudio size={18} /> Listen
            </button>
          </div>

          <button onClick={handleLibrary} className="btn-library" style={{ marginBottom: "24px" }}>
            <BsBookmark size={18} /> Add title to My Library
          </button>

          {book.subscriptionRequired && (
            <div style={{ marginBottom: "24px" }}>
              <span className="book-pill">Premium</span>
            </div>
          )}

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>
            What&apos;s it about?
          </h2>
          <div className="flex flex-wrap gap-2" style={{ marginBottom: "16px" }}>
            {book.tags?.map((tag) => (
              <span key={tag} className="book-tag">{tag}</span>
            ))}
          </div>
          <p className="book-description" style={{ marginBottom: "32px" }}>
            {book.bookDescription}
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>
            About the author
          </h2>
          <p className="book-description">
            {book.authorDescription}
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start shrink-0">
          <figure style={{ position: "relative", width: "300px", height: "300px" }}>
            {book.imageLink && (
              <Image
                src={book.imageLink}
                alt={book.title}
                fill
                sizes="300px"
                className="object-contain"
              />
            )}
          </figure>
        </div>
      </div>
    </div>
  );
}