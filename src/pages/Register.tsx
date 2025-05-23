import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import RegisterForm from "../components/auth/RegisterForm";

const Register: React.FC = () => {
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
        Create an Account
      </h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
