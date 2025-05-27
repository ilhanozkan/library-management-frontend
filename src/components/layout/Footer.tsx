import React from "react";
import { BookOpen, Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">
                LibrarySystem
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              A comprehensive library management system to manage books, users,
              and borrowings with ease.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  Books
                </Link>
              </li>
              {!isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-sm text-gray-600 hover:text-primary-600"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-sm text-gray-600 hover:text-primary-600"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-2" />
                <a
                  href="mailto:support@ilhanozkan.com"
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  support@ilhanozkan.com
                </a>
              </li>
              <li className="flex items-center">
                <Github className="h-5 w-5 text-gray-500 mr-2" />
                <a
                  href="https://github.com/ilhanozkan"
                  className="text-sm text-gray-600 hover:text-primary-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Library Management System. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
