import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Save, X } from "lucide-react";

import { BookFormData } from "../../types";
import { bookService } from "../../services/api";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

interface BookFormProps {
  initialData?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookFormData>({
    defaultValues: initialData || {
      name: "",
      isbn: "",
      author: "",
      publisher: "",
      numberOfPages: 0,
      quantity: 1,
      genre: "",
    },
  });

  const { data: genres } = useQuery({
    queryKey: ["bookGenres"],
    queryFn: bookService.getBookGenres,
  });

  const handleGenreChange = (value: string) => {
    setValue("genre", value);
  };

  const genreOptions = genres
    ? genres.map((genre) => ({
        value: genre,
        label: genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase(),
      }))
    : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Book Title"
          fullWidth
          {...register("name", { required: "Book title is required" })}
          error={errors.name?.message}
        />

        <Input
          label="ISBN"
          fullWidth
          {...register("isbn", {
            required: "ISBN is required",
            pattern: {
              value: /^(?:\d[\ |-]?){10,13}$/,
              message: "Please enter a valid ISBN",
            },
          })}
          error={errors.isbn?.message}
        />

        <Input
          label="Author"
          fullWidth
          {...register("author", { required: "Author is required" })}
          error={errors.author?.message}
        />

        <Input
          label="Publisher"
          fullWidth
          {...register("publisher", { required: "Publisher is required" })}
          error={errors.publisher?.message}
        />

        <Input
          label="Number of Pages"
          type="number"
          fullWidth
          {...register("numberOfPages", {
            required: "Number of pages is required",
            min: {
              value: 1,
              message: "Pages must be at least 1",
            },
            valueAsNumber: true,
          })}
          error={errors.numberOfPages?.message}
        />

        <Input
          label="Quantity"
          type="number"
          fullWidth
          {...register("quantity", {
            required: "Quantity is required",
            min: {
              value: 1,
              message: "Quantity must be at least 1",
            },
            valueAsNumber: true,
          })}
          error={errors.quantity?.message}
        />

        <div className="md:col-span-2">
          <Select
            label="Genre"
            options={genreOptions}
            value={initialData?.genre || ""}
            onChange={handleGenreChange}
            error={errors.genre?.message}
            fullWidth
            {...register("genre", { required: "Genre is required" })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          leftIcon={<X className="w-4 h-4" />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {initialData?.name ? "Update Book" : "Add Book"}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
