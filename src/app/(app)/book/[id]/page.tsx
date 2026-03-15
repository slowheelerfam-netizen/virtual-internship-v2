"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Book } from "@/types/book";
import Image from "next/image";
import { BsBookmark, BsStar, BsMic } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { AiOutlineAudio} from "react-icons/ai";
import { HiOutlineLightBulb } from "react-icons/hi";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/modalSlice";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { LuBookOpenText } from "react-icons/lu";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    if (!book?.audioLink) return;
    const audio = new Audio(book.audioLink);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => {
      setDuration(formatDuration(audio.duration));
    });
    return () => {
      audio.src = "";
    };
  }, [book?.audioLink]);

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
      <div className="app-page">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="skeleton" style={{ height: "36px", width: "70%", borderRadius: "6px" }} />
            <div className="skeleton" style={{ height: "22px", width: "40%", borderRadius: "6px" }} />
            <div className="skeleton" style={{ height: "22px", width: "60%", borderRadius: "6px" }} />
            <div className="skeleton" style={{ height: "80px", width: "100%", borderRadius: "6px" }} />
            <div style={{ display: "flex", gap: "16px" }}>
              <div className="skeleton" style={{ height: "52px", width: "140px", borderRadius: "4px" }} />
              <div className="skeleton" style={{ height: "52px", width: "140px", borderRadius: "4px" }} />
            </div>
            <div className="skeleton" style={{ height: "22px", width: "200px", borderRadius: "4px" }} />
            <div className="skeleton" style={{ height: "28px", width: "50%", borderRadius: "6px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="skeleton" style={{ height: "36px", width: "80px", borderRadius: "4px" }} />
              <div className="skeleton" style={{ height: "36px", width: "100px", borderRadius: "4px" }} />
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "16px", width: "100%", borderRadius: "4px" }} />
            ))}
          </div>
          <div className="skeleton" style={{ width: "300px", height: "300px", flexShrink: 0, borderRadius: "6px" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-page" style={{ position: "relative" }}>
      {book.imageLink && (
        <figure style={{ position: "absolute", top: "24px", right: "48px", width: "300px", height: "300px", zIndex: 1 }}>
          <Image
            src={book.imageLink}
            alt={book.title}
            fill
            sizes="300px"
            className="object-contain"
          />
        </figure>
      )}
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1" style={{ paddingRight: "280px" }}>

          {/* Premium pill — above title */}
          {book.subscriptionRequired && (
            <div style={{ marginBottom: "12px" }}>
              <span className="book-pill">Premium</span>
            </div>
          )}

          <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#032b41", marginBottom: "8px" }}>
            {book.title}
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#032b41", marginBottom: "8px" }}>
            {book.author}
          </p>
          <p style={{ fontSize: "20px", fontWeight: 300, color: "#032b41", marginBottom: "24px" }}>
            {book.subTitle}
          </p>

          {/* Stats grid */}
          <div style={{ borderTop: "1px solid #e1e7ea", borderBottom: "1px solid #e1e7ea", padding: "16px 0", marginBottom: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 500, color: "#032b41" }}>
              <BsStar size={22} style={{ flexShrink: 0 }} />
              <span>{book.averageRating} ({book.totalRating} ratings)</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 500, color: "#032b41" }}>
              <BiTime size={22} style={{ flexShrink: 0 }} />
              <span>{duration ?? "..."}</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 500, color: "#032b41" }}>
              <AiOutlineAudio size={22} style={{ flexShrink: 0 }} />
              <span>{book.type}</span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 500, color: "#032b41" }}>
              <HiOutlineLightBulb size={22} style={{ flexShrink: 0 }} />
              <span>{book.keyIdeas} Key ideas</span>
            </div>
          </div>

          {/* Read / Listen buttons */}
          <div className="flex gap-4" style={{ marginBottom: "16px" }}>
            <button
              onClick={handleReadListen}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#032b41",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 400,
                borderRadius: "4px",
                padding: "0 24px",
                height: "48px",
                minWidth: "140px",
                transition: "background-color 200ms",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#04405e")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#032b41")}
            >
              <LuBookOpenText size={20} /> Read
            </button>
            <button
              onClick={handleReadListen}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#032b41",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 400,
                borderRadius: "4px",
                padding: "0 24px",
                height: "48px",
                minWidth: "140px",
                transition: "background-color 200ms",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#04405e")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#032b41")}
            >
              <BsMic size={18} /> Listen
            </button>
          </div>

          <button onClick={handleLibrary} className="btn-library" style={{ marginBottom: "24px" }}>
            <BsBookmark size={18} /> Add title to My Library
          </button>

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


      </div>
    </div>
  );
}