"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setForm(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user");
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("User updated successfully!");
      router.push("/users");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("User deleted successfully!");
      router.push("/users");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full p-6 md:p-10">
      <Link
        href="/users"
        className="text-sm text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to All Users
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-orange-600">Edit User</h1>

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

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Update
          </Button>

          <Button type="button" onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
