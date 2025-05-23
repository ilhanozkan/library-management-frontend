export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  role: "LIBRARIAN" | "PATRON";
  status: "ACTIVE" | "INACTIVE";
}

export interface AuthUser {
  username: string;
  role: User["role"];
}

export interface Book {
  id: string;
  name: string;
  isbn: string;
  author: string;
  publisher: string;
  numberOfPages: number;
  quantity: number;
  availableQuantity: number;
  genre: string;
}

export interface Borrowing {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: User["status"];
  book?: Book;
  user?: User;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: User["role"];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface BookFormData {
  name: string;
  isbn: string;
  author: string;
  publisher: string;
  numberOfPages: number;
  quantity: number;
  genre: string;
}

export interface UserFormData {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  role: User["role"];
  status: User["status"];
}

export interface SearchBooksParams {
  title?: string;
  author?: string;
  isbn?: string;
  genre?: string;
  page?: number;
  size?: number;
}
