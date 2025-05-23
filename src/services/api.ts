import axios from "axios";
import { jwtDecode } from "jwt-decode";

import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Book,
  Borrowing,
  PaginatedResponse,
  SearchBooksParams,
  BookFormData,
  UserFormData,
} from "../types";

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not a retry, logout the user
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear local storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },

  isTokenValid: (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      return null;
    }
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Book services
export const bookService = {
  getAllBooks: async (
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Book>> => {
    const response = await api.get<PaginatedResponse<Book>>(
      `/books?page=${page}&size=${size}`
    );
    return response.data;
  },

  searchBooks: async (
    params: SearchBooksParams
  ): Promise<PaginatedResponse<Book>> => {
    const queryParams = new URLSearchParams();

    if (params.title) queryParams.append("title", params.title);
    if (params.author) queryParams.append("author", params.author);
    if (params.isbn) queryParams.append("isbn", params.isbn);
    if (params.genre) queryParams.append("genre", params.genre);
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());

    const response = await api.get<PaginatedResponse<Book>>(
      `/books/search?${queryParams.toString()}`
    );
    return response.data;
  },

  getBookById: async (id: string): Promise<Book> => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  getBookByIsbn: async (isbn: string): Promise<Book> => {
    const response = await api.get<Book>(`/books/isbn/${isbn}`);
    return response.data;
  },

  createBook: async (bookData: BookFormData): Promise<Book> => {
    const response = await api.post<Book>("/books", bookData);
    return response.data;
  },

  updateBook: async (id: string, bookData: BookFormData): Promise<Book> => {
    const response = await api.put<Book>(`/books/${id}`, bookData);
    return response.data;
  },

  updateBookQuantity: async (
    id: string,
    availableQuantity: number
  ): Promise<Book> => {
    const response = await api.put<Book>(`/books/${id}/available-quantity`, {
      availableQuantity,
    });
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  getBookGenres: async (): Promise<string[]> => {
    const response = await api.get<string[]>("/enums/book-genres");
    return response.data;
  },
};

// User services
export const userService = {
  getAllUsers: async (
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>(
      `/users?page=${page}&size=${size}`
    );
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const response = await api.get<User>(`/users/email/${email}`);
    return response.data;
  },

  createUser: async (userData: UserFormData): Promise<User> => {
    const response = await api.post<User>("/users", userData);
    return response.data;
  },

  updateUser: async (id: string, userData: UserFormData): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  deactivateUser: async (id: string): Promise<User> => {
    const response = await api.put<User>(`/users/${id}/deactivate`);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Borrowing services
export const borrowingService = {
  getAllBorrowings: async (): Promise<Borrowing[]> => {
    const response = await api.get<Borrowing[]>("/borrowings");
    return response.data;
  },

  getUserBorrowings: async (userId: string): Promise<Borrowing[]> => {
    const response = await api.get<Borrowing[]>(`/borrowings/user/${userId}`);
    return response.data;
  },

  getUserActiveBorrowings: async (userId: string): Promise<Borrowing[]> => {
    const response = await api.get<Borrowing[]>(
      `/borrowings/user/${userId}/active`
    );
    return response.data;
  },

  getMyBorrowingHistory: async (): Promise<Borrowing[]> => {
    const response = await api.get<Borrowing[]>("/borrowings/my-history");
    return response.data;
  },

  getMyActiveBorrowings: async (): Promise<Borrowing[]> => {
    const response = await api.get<Borrowing[]>("/borrowings/my-active");
    return response.data;
  },

  borrowBook: async (bookId: string): Promise<Borrowing> => {
    const response = await api.post<Borrowing>(`/borrowings?bookId=${bookId}`);
    return response.data;
  },

  librarianCreateBorrowing: async (
    bookId: string,
    userId: string
  ): Promise<Borrowing> => {
    const formData = new FormData();
    formData.append("bookId", bookId);
    formData.append("userId", userId);

    const response = await api.post<Borrowing>(
      "/borrowings/librarian",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  },

  returnBook: async (borrowingId: string): Promise<Borrowing> => {
    const response = await api.put<Borrowing>(
      `/borrowings/${borrowingId}/return`
    );
    return response.data;
  },

  deleteBorrowing: async (borrowingId: string): Promise<void> => {
    await api.delete(`/borrowings/${borrowingId}`);
  },

  getOverdueTextReport: async (): Promise<string> => {
    const response = await api.get<string>("/borrowings/overdue-report", {
      responseType: "text",
    });
    return response.data;
  },

  getOverduePdfReport: async (): Promise<Blob> => {
    const response = await api.get<Blob>("/borrowings/overdue-pdf-report", {
      responseType: "blob",
    });
    return response.data;
  },
};

export default api;
