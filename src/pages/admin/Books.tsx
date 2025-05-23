import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Search } from "lucide-react";

import { bookService } from "../../services/api";
import BookForm from "../../components/admin/BookForm";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardBody } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/ui/Pagination";

const AdminBooks: React.FC = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminBooks", page, search],
    queryFn: () => bookService.getAllBooks(page, 10),
  });

  const deleteMutation = useMutation({
    mutationFn: bookService.deleteBook,
    onSuccess: () => {
      toast.success("Book deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete book");
    },
  });

  const handleEdit = (book: any) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedBook) {
        await bookService.updateBook(selectedBook.id, data);
        toast.success("Book updated successfully");
      } else {
        await bookService.createBook(data);
        toast.success("Book created successfully");
      }
      setIsFormOpen(false);
      setSelectedBook(null);
      refetch();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedBook(null);
            setIsFormOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Book
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="max-w-md"
        />
      </div>

      {isFormOpen && (
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">
              {selectedBook ? "Edit Book" : "Add New Book"}
            </h2>
            <BookForm
              initialData={selectedBook}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedBook(null);
              }}
            />
          </CardBody>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {data?.content.map((book: any) => (
              <Card key={book.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{book.name}</h3>
                      <p className="text-gray-600">by {book.author}</p>
                      <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          book.availableQuantity > 0 ? "success" : "error"
                        }
                      >
                        {book.availableQuantity} / {book.quantity} available
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {data && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminBooks;
