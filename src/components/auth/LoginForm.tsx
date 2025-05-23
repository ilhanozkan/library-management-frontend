import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";

import { useAuthStore } from "../../store/authStore";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await login(data.username, data.password);
    if (!error) {
      navigate("/");
    } else {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <LogIn className="h-12 w-12 text-primary-600" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Sign In
      </h2>

      {error && (
        <div className="bg-error-50 text-error-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          fullWidth
          {...register("username", { required: "Username is required" })}
          error={errors.username?.message}
        />

        <Input
          label="Password"
          type="password"
          fullWidth
          {...register("password", { required: "Password is required" })}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
