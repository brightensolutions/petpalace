"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function AddUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    role: "user",
  });

  const isEditMode = Boolean(userId);

  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/admin/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            name: data.name || "",
            email: data.email || "",
            number: data.number || "",
            role: data.role || "user",
          });
        })
        .catch(() => toast.error("Failed to fetch user"));
    }
  }, [isEditMode, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        isEditMode ? `/api/admin/users/${userId}` : "/api/admin/users",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      toast.success(isEditMode ? "User updated!" : "User added!");
      router.push("/users");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/admin/users"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to All Users
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        {isEditMode ? "Edit User" : "Add New User"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="number">Phone</Label>
          <Input
            id="number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button
          type="submit"
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          {isEditMode ? "Update User" : "Add User"}
        </Button>
      </form>
    </div>
  );
}
