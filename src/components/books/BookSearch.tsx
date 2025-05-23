import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { bookService } from "../../services/api";
import { SearchBooksParams } from "../../types";

interface BookSearchProps {
  onSearch: (params: SearchBooksParams) => void;
  initialParams?: SearchBooksParams;
}

const BookSearch: React.FC<BookSearchProps> = ({
  onSearch,
  initialParams = {},
}) => {
  const [searchParams, setSearchParams] = useState<SearchBooksParams>({
    title: initialParams.title || "",
    author: initialParams.author || "",
    isbn: initialParams.isbn || "",
    genre: initialParams.genre || "",
  });

  const { data: genres } = useQuery({
    queryKey: ["bookGenres"],
    queryFn: bookService.getBookGenres,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, genre: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchParams({
      title: "",
      author: "",
      isbn: "",
      genre: "",
    });
    onSearch({});
  };

  const genreOptions = genres
    ? [
        { value: "", label: "All Genres" },
        ...genres.map((genre) => ({
          value: genre,
          label: genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase(),
        })),
      ]
    : [{ value: "", label: "All Genres" }];

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Search Books</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            name="title"
            value={searchParams.title}
            onChange={handleInputChange}
            placeholder="Book Title"
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Input
            name="author"
            value={searchParams.author}
            onChange={handleInputChange}
            placeholder="Author"
          />

          <Input
            name="isbn"
            value={searchParams.isbn}
            onChange={handleInputChange}
            placeholder="ISBN"
          />

          <Select
            options={genreOptions}
            value={searchParams.genre}
            onChange={handleGenreChange}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            leftIcon={<X className="w-4 h-4" />}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Search className="w-4 h-4" />}
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookSearch;
