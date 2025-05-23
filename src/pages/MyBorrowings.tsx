import React from "react";

import BorrowingList from "../components/borrowings/BorrowingList";

const MyBorrowings: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Borrowings</h1>
      <BorrowingList />
    </div>
  );
};

export default MyBorrowings;
