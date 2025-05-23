import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { borrowingService } from "../../services/api";
import BorrowingCard from "./BorrowingCard";
import { CalendarClock } from "lucide-react";

const BorrowingList: React.FC = () => {
  const [isReturning, setIsReturning] = useState(false);

  const {
    data: activeBorrowings,
    isLoading: isLoadingActive,
    refetch: refetchActive,
  } = useQuery({
    queryKey: ["activeBorrowings"],
    queryFn: borrowingService.getMyActiveBorrowings,
  });

  const {
    data: borrowingHistory,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["borrowingHistory"],
    queryFn: borrowingService.getMyBorrowingHistory,
  });

  const returnMutation = useMutation({
    mutationFn: (borrowingId: string) =>
      borrowingService.returnBook(borrowingId),
    onMutate: () => {
      setIsReturning(true);
    },
    onSuccess: () => {
      toast.success("Book returned successfully!");
      refetchActive();
      refetchHistory();
      setIsReturning(false);
    },
    onError: (error) => {
      toast.error("Failed to return book. Please try again.");
      console.error("Return error:", error);
      setIsReturning(false);
    },
  });

  const handleReturnBook = (borrowingId: string) => {
    returnMutation.mutate(borrowingId);
  };

  const isLoading = isLoadingActive || isLoadingHistory;
  const hasNoBorrowings =
    (!activeBorrowings || activeBorrowings.length === 0) &&
    (!borrowingHistory || borrowingHistory.length === 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (hasNoBorrowings) {
    return (
      <div className="text-center py-12">
        <CalendarClock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No borrowing history
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't borrowed any books yet. Browse our collection and start
          reading!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {activeBorrowings && activeBorrowings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Active Borrowings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeBorrowings.map((borrowing) => (
              <BorrowingCard
                key={borrowing.id}
                borrowing={borrowing}
                onReturn={handleReturnBook}
                isLoading={isReturning}
              />
            ))}
          </div>
        </div>
      )}

      {borrowingHistory && borrowingHistory.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Borrowing History
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {borrowingHistory
              .filter((borrowing) => borrowing.returnDate)
              .map((borrowing) => (
                <BorrowingCard key={borrowing.id} borrowing={borrowing} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowingList;
