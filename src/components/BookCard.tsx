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
    >
      {/* Premium pill */}
      {book.subscriptionRequired && (
        <span className="absolute top-3 right-3 bg-[#032b41] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
          Premium
        </span>
      )}

      {/* Cover image */}
      <figure className="relative w-full h-[172px] mb-3 overflow-hidden rounded">
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
      <p className="text-[#032b41] font-bold text-sm leading-snug mb-1 line-clamp-2">
        {book.title}
      </p>

      {/* Author */}
      <p className="text-[#6b757b] text-xs mb-1">{book.author}</p>

      {/* Subtitle */}
      <p className="text-[#394547] text-xs font-light leading-snug mb-2 line-clamp-2">
        {book.subTitle}
      </p>

      {/* Duration + Rating */}
      <div className="flex items-center gap-3 text-[#032b41] text-xs mt-auto">
        <span className="flex items-center gap-1">
          <BiTime className="text-sm" />
          3 mins
        </span>
        <span className="flex items-center gap-1">
          <BsStar className="text-sm" />
          {book.averageRating}
        </span>
      </div>
    </Link>
  );
}
