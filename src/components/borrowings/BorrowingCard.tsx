import React from "react";
import { format, isPast } from "date-fns";
import { BookOpen, CalendarClock, CheckCircle2 } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Borrowing } from "../../types";

interface BorrowingCardProps {
  borrowing: Borrowing;
  onReturn?: (borrowingId: string) => void;
  isLoading?: boolean;
}

const BorrowingCard: React.FC<BorrowingCardProps> = ({
  borrowing,
  onReturn,
  isLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const isOverdue =
    !borrowing.returnDate && isPast(new Date(borrowing.dueDate));
  const isActive = !borrowing.returnDate;

  const getStatusBadge = () => {
    if (borrowing.returnDate) {
      return <Badge variant="success">Returned</Badge>;
    }

    if (isOverdue) {
      return <Badge variant="error">Overdue</Badge>;
    }

    return <Badge variant="primary">Active</Badge>;
  };

  return (
    <Card hoverable className="h-full flex flex-col">
      <CardBody className="flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {borrowing.book?.name || "Unknown Book"}
          </h3>
          {getStatusBadge()}
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <BookOpen className="w-4 h-4 mr-1" />
          <span>{borrowing.book?.author || "Unknown Author"}</span>
        </div>

        <div className="mt-2 mb-4 flex-grow">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Borrowed:</span>
            <span className="font-medium">
              {formatDate(borrowing.borrowDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Due Date:</span>
            <span
              className={`font-medium ${isOverdue ? "text-error-600" : ""}`}
            >
              {formatDate(borrowing.dueDate)}
            </span>
          </div>
          {borrowing.returnDate && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Returned:</span>
              <span className="font-medium">
                {formatDate(borrowing.returnDate)}
              </span>
            </div>
          )}
        </div>

        {isActive && onReturn && (
          <div className="flex items-center justify-center mt-auto pt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onReturn(borrowing.id)}
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Return Book
            </Button>
          </div>
        )}

        {!isActive && (
          <div className="flex items-center justify-center mt-auto pt-4 text-success-600">
            <CalendarClock className="w-5 h-5 mr-2" />
            <span className="font-medium">Returned</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default BorrowingCard;
