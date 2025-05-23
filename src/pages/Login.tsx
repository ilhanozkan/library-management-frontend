import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import LoginForm from "../components/auth/LoginForm";

const Login: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
        Welcome Back
      </h1>
      <LoginForm />
    </div>
  );
};

export default Login;
