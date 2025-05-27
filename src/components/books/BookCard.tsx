import React from "react";
import { Link } from "react-router-dom";
import { Book as BookIcon, BookOpen } from "lucide-react";

import { Book } from "../../types";
import { Card, CardBody } from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  isLoading?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onBorrow,
  isLoading = false,
}) => {
  const isAvailable = book.availableQuantity > 0;

  return (
    <Card hoverable className="h-full flex flex-col">
      <CardBody className="flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {book.name}
          </h3>
          <Badge variant={isAvailable ? "success" : "error"}>
            {isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <BookIcon className="w-4 h-4 mr-1" />
          <span>{book.author}</span>
        </div>

        <div className="mt-2 mb-4 flex-grow">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>ISBN:</span>
            <span className="font-medium">{book.isbn}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Genre:</span>
            <span className="font-medium">{book.genre.toLowerCase()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pages:</span>
            <span className="font-medium">{book.numberOfPages}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4">
          <Link to={`/books/${book.id}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              Details
            </Button>
          </Link>

          {onBorrow && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBorrow(book.id)}
              disabled={!isAvailable || isLoading}
              isLoading={isLoading}
            >
              Borrow
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default BookCard;
