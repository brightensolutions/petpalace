"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // ✅ Toast import

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  parentId: string | null;
}

export default function ManageCategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
        } else {
          toast.error("Failed to load categories");
        }
      } catch (error) {
        toast.error("Error fetching categories");
      }
    };

    fetchCategories();
  }, []);

  const getParentName = (parentId: string | null) => {
    if (!parentId) return "-";
    const parent = categories.find((cat) => cat._id === parentId);
    return parent ? parent.name : "-";
  };

  const filteredCategories = categories.filter((cat) => {
    const parentName = getParentName(cat.parentId);
    const search = searchTerm.toLowerCase();
    return (
      cat.name.toLowerCase().includes(search) ||
      cat.slug.toLowerCase().includes(search) ||
      parentName.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
        toast.success("Category deleted successfully.");
      } else {
        toast.error("Failed to delete category.");
      }
    } catch (err) {
      toast.error("An error occurred while deleting.");
    }
  };

  const handlePageChange = (dir: "prev" | "next") => {
    if (dir === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (dir === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div className="grid gap-1 pt-6">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Categories
          </CardTitle>
          <CardDescription className="text-gray-500">
            Manage your product categories.
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search categories..."
            className="sm:w-64"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Select
            value={String(rowsPerPage)}
            onValueChange={(val) => {
              setRowsPerPage(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="40">40 rows</SelectItem>
              <SelectItem value="60">60 rows</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => router.push("/admin/categories/add")}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell>
                      <img
                        src={cat.image || "/placeholder.svg"}
                        alt={cat.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800">
                      {cat.name}
                    </TableCell>
                    <TableCell className="text-gray-600">{cat.slug}</TableCell>
                    <TableCell className="text-gray-600">
                      {getParentName(cat.parentId)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/categories/${cat._id}`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(cat._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-6"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange("prev")}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => handlePageChange("next")}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
