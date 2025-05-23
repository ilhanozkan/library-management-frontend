import React from "react";

import BookList from "../components/books/BookList";

const Books: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Catalog</h1>
      <BookList />
    </div>
  );
};

export default Books;
