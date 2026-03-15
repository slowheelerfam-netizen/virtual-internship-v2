'use client';

import { auth, db } from "@/lib/firebase";
import { Book } from "@/types/book";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { onAuthStateChanged, User } from "firebase/auth";
import Skeleton from "@/components/Skeleton";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/modalSlice";
import Image from "next/image";

export default function LibraryPage() {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    async function getLibraryBooks() {
      if (user && user.uid) {
        const savedBooksRef = collection(db, "users", user.uid, "savedBooks");
        const finishedBooksRef = collection(db, "users", user.uid, "finishedBooks");

        const [savedBooksSnapshot, finishedBooksSnapshot] = await Promise.all([
          getDocs(savedBooksRef),
          getDocs(finishedBooksRef),
        ]);

        setSavedBooks(savedBooksSnapshot.docs.map((doc) => doc.data() as Book));
        setFinishedBooks(finishedBooksSnapshot.docs.map((doc) => doc.data() as Book));
        setLoading(false);
      }
    }

    getLibraryBooks();
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="app-page">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: "40px" }}>
          <div style={{ width: "300px", marginBottom: "16px" }}>
            <Image src="/login.png" alt="Login to see your library" width={300} height={300} style={{ width: "100%", height: "auto" }} />
          </div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>
            Log in to your account to see your library.
          </p>
          <button
            style={{ width: "300px", height: "52px", backgroundColor: "#2bd97c", color: "#032b41", fontSize: "16px", fontWeight: 600, borderRadius: "4px", border: "none", cursor: "pointer", transition: "background-color 200ms" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#20ba68")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2bd97c")}
            onClick={() => dispatch(openModal("login"))}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      {/* Saved Books */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>
          Saved Books
        </h2>
        <p style={{ fontSize: "14px", color: "#394547", marginBottom: "16px" }}>
          {loading ? "..." : `${savedBooks.length} item${savedBooks.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div style={{ display: "flex", gap: "16px" }}>
            {new Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ flexShrink: 0, width: "172px" }}>
                <Skeleton width="172px" height="200px" />
                <Skeleton width="172px" height="20px" />
                <Skeleton width="100px" height="20px" />
              </div>
            ))}
          </div>
        ) : savedBooks.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "nowrap", gap: "16px", overflowX: "auto", paddingBottom: "12px", scrollbarWidth: "thin" }}>
            {savedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div style={{ backgroundColor: "#f1f6f4", borderRadius: "8px", padding: "32px", maxWidth: "360px" }}>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "8px" }}>
              Save your favorite books!
            </p>
            <p style={{ fontSize: "14px", color: "#394547" }}>
              When you save a book, it will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Finished Books */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>
          Finished
        </h2>
        <p style={{ fontSize: "14px", color: "#394547", marginBottom: "16px" }}>
          {loading ? "..." : `${finishedBooks.length} item${finishedBooks.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div style={{ display: "flex", gap: "16px" }}>
            {new Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ flexShrink: 0, width: "172px" }}>
                <Skeleton width="172px" height="200px" />
                <Skeleton width="172px" height="20px" />
                <Skeleton width="100px" height="20px" />
              </div>
            ))}
          </div>
        ) : finishedBooks.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "nowrap", gap: "16px", overflowX: "auto", paddingBottom: "12px", scrollbarWidth: "thin" }}>
            {finishedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "14px", color: "#394547" }}>
            You have not finished any books.
          </p>
        )}
      </section>
    </div>
  );
}