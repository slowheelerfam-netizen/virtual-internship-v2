"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Book } from "@/types/book";
import Image from "next/image";
import { BsBookmark, BsStar } from "react-icons/bs";
import { BiTime, BiBook } from "react-icons/bi";
import { AiFillAudio } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openModal } from "@/store/modalSlice";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

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

  if (!book) return <div className="book__page--loading">Loading...</div>;

  return (
    <div className="book__page">
      <div className="book__page--container">
        <div className="book__page--left">
          <div className="book__page--title">{book.title}</div>
          <div className="book__page--author">{book.author}</div>
          <div className="book__page--subtitle">{book.subTitle}</div>

          <div className="book__page--details">
            <div className="book__page--detail">
              <BsStar />
              <span>{book.averageRating} ({book.totalRating} ratings)</span>
            </div>
            <div className="book__page--detail">
              <BiTime />
              <span>3 mins</span>
            </div>
            <div className="book__page--detail">
              <AiFillAudio />
              <span>{book.type}</span>
            </div>
            <div className="book__page--detail">
              <BiBook />
              <span>{book.keyIdeas} Key ideas</span>
            </div>
          </div>

          <div className="book__page--buttons">
            <button className="btn book__page--btn" onClick={handleReadListen}>
              <BiBook /> Read
            </button>
            <button className="btn book__page--btn" onClick={handleReadListen}>
              <AiFillAudio /> Listen
            </button>
          </div>
          <div className="book__page--library">
            <button className="book__page--library-btn" onClick={() => {}}>
                <BsBookmark />
                Add title to My Library
            </button>
          </div>
          {book.subscriptionRequired && (
          <div className="book__page--pill">Premium</div>
          )}

          <div className="book__page--description-title">What&apos;s it about?</div>
          <div className="book__page--tags">
            {book.tags?.map((tag) => (
              <div key={tag} className="book__page--tag">{tag}</div>
            ))}
          </div>
          <div className="book__page--description">{book.bookDescription}</div>

          <div className="book__page--description-title">About the author</div>
          <div className="book__page--description">{book.authorDescription}</div>
        </div>

        <div className="book__page--right">
          {book.imageLink && (
            <figure className="book__page--image-mask">
              <Image
                src={book.imageLink}
                alt={book.title}
                width={300}
                height={300}
              />
            </figure>
          )}
        </div>
      </div>
    </div>
  );
}