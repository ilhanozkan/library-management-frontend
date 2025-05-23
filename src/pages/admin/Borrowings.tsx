import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Download } from "lucide-react";

import { borrowingService } from "../../services/api";
import Button from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const AdminBorrowings: React.FC = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const { data: borrowings, isLoading } = useQuery({
    queryKey: ["adminBorrowings"],
    queryFn: borrowingService.getAllBorrowings,
  });

  const returnMutation = useMutation({
    mutationFn: borrowingService.returnBook,
    onSuccess: () => {
      toast.success("Book returned successfully");
      // Refetch borrowings
      refetch();
    },
    onError: () => {
      toast.error("Failed to return book");
    },
  });

  const handleReturn = async (borrowingId: string) => {
    if (
      window.confirm("Are you sure you want to mark this book as returned?")
    ) {
      returnMutation.mutate(borrowingId);
    }
  };

  const handleDownloadPdfReport = async () => {
    try {
      setIsGeneratingReport(true);
      const blob = await borrowingService.getOverduePdfReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "overdue-books-report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Borrowings</h1>
        <Button
          variant="primary"
          onClick={handleDownloadPdfReport}
          isLoading={isGeneratingReport}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download Overdue Report
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {borrowings?.map((borrowing: any) => (
            <Card key={borrowing.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {borrowing.book?.name}
                    </h3>
                    <p className="text-gray-600">
                      Borrowed by: {borrowing.user?.name}{" "}
                      {borrowing.user?.surname}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        Borrow Date:{" "}
                        {new Date(borrowing.borrowDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due Date:{" "}
                        {new Date(borrowing.dueDate).toLocaleDateString()}
                      </p>
                      {borrowing.returnDate && (
                        <p className="text-sm text-gray-500">
                          Return Date:{" "}
                          {new Date(borrowing.returnDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        borrowing.returnDate
                          ? "success"
                          : new Date(borrowing.dueDate) < new Date()
                          ? "error"
                          : "primary"
                      }
                    >
                      {borrowing.returnDate
                        ? "Returned"
                        : new Date(borrowing.dueDate) < new Date()
                        ? "Overdue"
                        : "Active"}
                    </Badge>
                    {!borrowing.returnDate && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReturn(borrowing.id)}
                      >
                        Mark as Returned
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBorrowings;
