import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Book as BookIcon,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";

import { bookService, borrowingService } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Card, CardBody } from "../ui/Card";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const {
    data: book,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookService.getBookById(id!),
    enabled: !!id,
  });

  const borrowMutation = useMutation({
    mutationFn: (bookId: string) => borrowingService.borrowBook(bookId),
    onSuccess: () => {
      toast.success("Book borrowed successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to borrow book. Please try again.");
      console.error("Borrow error:", error);
    },
  });

  const handleBorrow = () => {
    if (!isAuthenticated) {
      toast.info("Please login to borrow books");
      navigate("/login");
      return;
    }

    if (id) {
      borrowMutation.mutate(id);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Book not found
        </h2>
        <Button
          variant="outline"
          onClick={handleGoBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const isAvailable = book.availableQuantity > 0;
  const isLibrarian = user?.role === "LIBRARIAN";

  return (
    <div className="animate-fade-in">
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={handleGoBack}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
      >
        Back to Books
      </Button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 md:flex-1">
              <div className="flex items-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mr-3">
                  {book.name}
                </h1>
                <Badge variant={isAvailable ? "success" : "error"}>
                  {isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <User className="w-5 h-5 mr-2" />
                <span className="text-lg">{book.author}</span>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">ISBN</p>
                  <p className="text-gray-900">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Genre</p>
                  <p className="text-gray-900">{book.genre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Publisher</p>
                  <p className="text-gray-900">{book.publisher}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pages</p>
                  <p className="text-gray-900">{book.numberOfPages}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Availability
                </p>
                <div className="flex items-center">
                  <span className="text-lg font-medium text-gray-900">
                    {book.availableQuantity} / {book.quantity}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    copies available
                  </span>
                </div>
              </div>

              {!isLibrarian && (
                <Button
                  variant="primary"
                  onClick={handleBorrow}
                  disabled={!isAvailable || borrowMutation.isPending}
                  isLoading={borrowMutation.isPending}
                  leftIcon={<BookOpen className="w-5 h-5" />}
                >
                  Borrow Book
                </Button>
              )}

              {isLibrarian && (
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                    leftIcon={<BookIcon className="w-5 h-5" />}
                  >
                    Edit Book
                  </Button>
                </div>
              )}
            </div>

            <div className="md:w-1/3">
              <Card className="bg-gray-50">
                <CardBody>
                  <h3 className="font-medium text-lg mb-4 text-gray-900">
                    Borrowing Information
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Loan Period</p>
                        <p className="text-sm text-gray-600">
                          Standard loan period is 14 days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <BookOpen className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Late Returns
                        </p>
                        <p className="text-sm text-gray-600">
                          Please return books on time to avoid penalties
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
