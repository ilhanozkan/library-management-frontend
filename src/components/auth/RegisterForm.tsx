import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";

import { useAuthStore } from "../../store/authStore";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
}

const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading, registerError, resetRegisterError } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    const success = await registerUser(
      data.username,
      data.email,
      data.password,
      data.name,
      data.surname
    );

    if (success) {
      toast.success("Account created successfully, please login to continue");
      navigate("/login");
    }
  };

  useEffect(() => {
    // Reset register error when component unmounts
    return () => {
      if (registerError) resetRegisterError();
    };
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <UserPlus className="h-12 w-12 text-primary-600" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Create an Account
      </h2>

      {registerError && (
        <div className="bg-error-50 text-error-700 p-3 rounded mb-4">
          {registerError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            fullWidth
            {...register("name", { required: "First name is required" })}
            error={errors.name?.message}
          />

          <Input
            label="Last Name"
            fullWidth
            {...register("surname", { required: "Last name is required" })}
            error={errors.surname?.message}
          />
        </div>

        <Input
          label="Username"
          fullWidth
          {...register("username", { required: "Username is required" })}
          error={errors.username?.message}
        />

        <Input
          label="Email"
          type="email"
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          fullWidth
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          fullWidth
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
