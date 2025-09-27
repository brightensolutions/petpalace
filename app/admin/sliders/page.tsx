"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, PlusCircle, Link as LinkIcon } from "lucide-react";
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

interface Slider {
  _id: string;
  image: string;
  link: string;
}

export default function ManageSlidersPage() {
  const router = useRouter();

  const [sliders, setSliders] = useState<Slider[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch("/api/admin/sliders");
        const json = await res.json();
        if (json.success) {
          setSliders(json.data);
        } else {
          toast.error("Failed to load sliders");
        }
      } catch (error) {
        toast.error("Error fetching sliders");
      }
    };

    fetchSliders();
  }, []);

  const filteredSliders = sliders.filter((slider) => {
    const search = searchTerm.toLowerCase();
    return (
      slider.link.toLowerCase().includes(search) ||
      slider.image.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredSliders.length / rowsPerPage);
  const paginatedSliders = filteredSliders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;

    try {
      const res = await fetch(`/api/admin/sliders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSliders((prev) => prev.filter((s) => s._id !== id));
        toast.success("Slider deleted successfully.");
      } else {
        toast.error("Failed to delete slider.");
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
            Sliders
          </CardTitle>
          <CardDescription className="text-gray-500">
            Manage your homepage sliders.
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search sliders..."
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
            onClick={() => router.push("/admin/sliders/add")}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Slider
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSliders.length > 0 ? (
                paginatedSliders.map((slider) => (
                  <TableRow key={slider._id}>
                    <TableCell>
                      <img
                        src={slider.image || "/placeholder.svg"}
                        alt="slider"
                        className="h-12 w-48 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2 text-blue-600">
                      <LinkIcon className="w-4 h-4" />
                      <span>{slider.link}</span>
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
                              router.push(`/admin/sliders/${slider._id}`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(slider._id)}
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
                    colSpan={3}
                    className="text-center text-gray-500 py-6"
                  >
                    No sliders found.
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
