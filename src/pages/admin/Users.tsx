import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Plus, Search } from "lucide-react";

import { userService } from "../../services/api";
import UserForm from "../../components/admin/UserForm";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Card, CardBody } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/ui/Pagination";

const AdminUsers: React.FC = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["adminUsers", page, search],
    queryFn: () => userService.getAllUsers(page, 10),
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: userService.deactivateUser,
    onSuccess: () => {
      toast.success("User deactivated successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to deactivate user");
    },
  });

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      deactivateMutation.mutate(id);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, data);
        toast.success("User updated successfully");
      } else {
        await userService.createUser(data);
        toast.success("User created successfully");
      }
      setIsFormOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New User
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="max-w-md"
        />
      </div>

      {isFormOpen && (
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">
              {selectedUser ? "Edit User" : "Add New User"}
            </h2>
            <UserForm
              initialData={selectedUser}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedUser(null);
              }}
              isEditing={!!selectedUser}
            />
          </CardBody>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {data?.content.map((user: any) => (
              <Card key={user.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.name} {user.surname}
                      </h3>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Username: {user.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={user.status === "ACTIVE" ? "success" : "error"}
                      >
                        {user.status}
                      </Badge>
                      <Badge variant="primary">{user.role}</Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        {user.status === "ACTIVE" && (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleDeactivate(user.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {data && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
