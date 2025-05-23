import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { SearchBooksParams } from "../../types";
import { bookService, borrowingService } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import BookCard from "./BookCard";
import BookSearch from "./BookSearch";
import Pagination from "../ui/Pagination";

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useState<SearchBooksParams>({});
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["books", searchParams, currentPage],
    queryFn: () =>
      searchParams.title ||
      searchParams.author ||
      searchParams.isbn ||
      searchParams.genre
        ? bookService.searchBooks({
            ...searchParams,
            page: currentPage,
            size: pageSize,
          })
        : bookService.getAllBooks(currentPage, pageSize),
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

  const handleSearch = (params: SearchBooksParams) => {
    setSearchParams(params);
    setCurrentPage(0);
  };

  const handleBorrow = (bookId: string) => {
    if (!isAuthenticated) {
      toast.info("Please login to borrow books");
      navigate("/login");
      return;
    }

    borrowMutation.mutate(bookId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <BookSearch onSearch={handleSearch} initialParams={searchParams} />

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : data?.content?.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.content.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onBorrow={handleBorrow}
                isLoading={borrowMutation.isPending}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No books found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookList;
