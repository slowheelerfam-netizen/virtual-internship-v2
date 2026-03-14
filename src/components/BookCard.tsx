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
    <Link href={`/book/${book.id}`} className="book__card">
      {book.subscriptionRequired && (
        <div className="book__pill">Premium</div>
      )}
      <figure className="book__image--mask">
        {book.imageLink && (
            <Image src={book.imageLink} alt={book.title} width={172} height={172} />
            )}
      </figure>
      <div className="book__title">{book.title}</div>
      <div className="book__author">{book.author}</div>
      <div className="book__sub--title">{book.subTitle}</div>
      <div className="book__details">
        <div className="book__details--info">
          <BiTime />
          <span>3 mins</span>
        </div>
        <div className="book__details--info">
          <BsStar />
          <span>{book.averageRating}</span>
        </div>
      </div>
    </Link>
  );
}