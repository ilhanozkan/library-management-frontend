import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAuthStore } from "../store/authStore";
// Layout
import Layout from "../components/layout/Layout";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Books from "../pages/Books";
import BookDetails from "../pages/BookDetails";
import MyBorrowings from "../pages/MyBorrowings";
import AdminUsers from "../pages/admin/Users";
import AdminBooks from "../pages/admin/Books";
import AdminBorrowings from "../pages/admin/Borrowings";

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const LibrarianRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "LIBRARIAN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "books", element: <Books /> },
      { path: "books/:id", element: <BookDetails /> },
      {
        path: "my-borrowings",
        element: (
          <ProtectedRoute>
            <MyBorrowings />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/books",
        element: (
          <LibrarianRoute>
            <AdminBooks />
          </LibrarianRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <LibrarianRoute>
            <AdminUsers />
          </LibrarianRoute>
        ),
      },
      {
        path: "admin/borrowings",
        element: (
          <LibrarianRoute>
            <AdminBorrowings />
          </LibrarianRoute>
        ),
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const Routes: React.FC = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default Routes;
