import React from "react";
import { useForm } from "react-hook-form";
import { Save, X } from "lucide-react";

import { UserFormData } from "../../types";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormData>({
    defaultValues: initialData || {
      username: "",
      email: "",
      password: "",
      name: "",
      surname: "",
      role: "PATRON",
      status: "ACTIVE",
    },
  });

  const roleOptions = [
    { value: "PATRON", label: "Patron" },
    { value: "LIBRARIAN", label: "Librarian" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  const handleRoleChange = (value: string) => {
    setValue("role", value as "LIBRARIAN" | "PATRON");
  };

  const handleStatusChange = (value: string) => {
    setValue("status", value as "ACTIVE" | "INACTIVE");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Username"
          fullWidth
          {...register("username", { required: "Username is required" })}
          error={errors.username?.message}
          disabled={isEditing}
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

        {!isEditing && (
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
        )}

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

        <Select
          label="Role"
          options={roleOptions}
          value={watch("role")}
          onChange={handleRoleChange}
          error={errors.role?.message}
          fullWidth
          {...register("role")}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={watch("status")}
          onChange={handleStatusChange}
          error={errors.status?.message}
          fullWidth
          {...register("status")}
        />
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
          {isEditing ? "Update User" : "Add User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
