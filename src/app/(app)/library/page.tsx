'use client';

import { auth, db } from "@/lib/firebase";
import { Book } from "@/types/book";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import { onAuthStateChanged, User } from "firebase/auth";
import Skeleton from "@/components/Skeleton";
import { useAppDispatch } from "@/store/hooks";
import { openModal, setView } from "@/store/modalSlice";
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

  return (
    <div className="app-page">
      {loading ? (
        <>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#032b41", marginBottom: "32px" }}>
            My Library
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {new Array(8).fill(0).map((_, index) => (
              <div key={index}>
                <Skeleton width="100%" height="200px" />
                <Skeleton width="100%" height="20px" />
                <Skeleton width="60%" height="20px" />
              </div>
            ))}
          </div>
        </>
      ) : user ? (
        <>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#032b41", marginBottom: "32px" }}>
            My Library
          </div>
          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>
              Saved Books
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedBooks.length > 0 ? (
                savedBooks.map((book) => <BookCard key={book.id} book={book} />)
              ) : (
                <p style={{ color: "#394547" }}>You have no saved books.</p>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>
              Finished
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {finishedBooks.length > 0 ? (
                finishedBooks.map((book) => <BookCard key={book.id} book={book} />)
              ) : (
                <p style={{ color: "#394547" }}>You have not finished any books.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            paddingTop: "40px",
          }}
        >
          {/* Image — constrained width, same as button below */}
          <div style={{ width: "460px", marginBottom: "16px" }}>
            <Image
              src="/login.png"
              alt="Login to see your library"
              width={300}
              height={300}
              style={{ width: "100%", height: "auto" }}
            />
          </div>

          {/* Text */}
          <p
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#032b41",
              marginBottom: "16px",
            }}
          >
            Log in to your account to see your library.
          </p>

          {/* Button — same width as image */}
          <button
            style={{
              width: "170px",
              height: "40px",
              backgroundColor: "#2bd97c",
              color: "#032b41",
              fontSize: "18px",
              fontWeight: 400,
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 200ms",
                }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#20ba68")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2bd97c")}
                  onClick={() => dispatch(openModal("login"))}
                >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
