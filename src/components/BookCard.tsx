import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types/book";
import { BsStar } from "react-icons/bs";
import { BiTime } from "react-icons/bi";

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  return (
    <Link
      href={`/book/${book.id}`}
      className="relative flex flex-col shrink-0 w-[172px] hover:bg-[#f1f6f4] rounded-lg p-3 transition-colors"
      style={{ textDecoration: "none" }}
    >
      {/* Premium pill */}
      {book.subscriptionRequired && (
        <span style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: "#032b41",
          color: "#fff",
          fontSize: "10px",
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: "20px",
          zIndex: 10,
        }}>
          Premium
        </span>
      )}

      {/* Cover image */}
      <figure className="relative w-full mb-3 overflow-hidden rounded" style={{ height: "172px" }}>
        {book.imageLink && (
          <Image
            src={book.imageLink}
            alt={book.title}
            fill
            sizes="172px"
            className="object-contain"
          />
        )}
      </figure>

      {/* Title */}
      <p style={{ color: "#032b41", fontWeight: 700, fontSize: "14px", lineHeight: 1.3, marginBottom: "4px", paddingTop: "8px" }}
         className="line-clamp-2">
        {book.title}
      </p>

      {/* Author */}
      <p style={{ color: "#6b757b", fontSize: "14px", marginBottom: "4px" }}>{book.author}</p>

      {/* Subtitle */}
      <p style={{ color: "#032b41", fontSize: "14px", fontWeight: 400, lineHeight: 1.4, marginBottom: "8px" }}
         className="line-clamp-2">
        {book.subTitle}
      </p>

      {/* Duration + Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#6b757b", fontSize: "12px", marginTop: "auto" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <BiTime />
          3 mins
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <BsStar />
          {book.averageRating}
        </span>
      </div>
    </Link>
  );
}