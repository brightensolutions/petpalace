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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Offer {
  _id: string;
  name: string;
  couponCode: string;
  type: "percentage" | "amount";
  value: number;
  status: "active" | "expired" | "scheduled";
  startDate?: string;
  expiryDate?: string;
  usageCount: number;
  usageLimit?: number;
}

export default function ManageOffersPage() {
  const router = useRouter();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      console.log("[v0] Fetching offers from /api/admin/offers");
      const res = await fetch("/api/admin/offers");
      const json = await res.json();
      console.log("[v0] Offers API response:", json);

      if (json.success) {
        setOffers(json.data);
        console.log("[v0] Loaded offers count:", json.data.length);
      } else {
        toast.error("Failed to load offers");
        console.error("[v0] Failed to load offers:", json.message);
      }
    } catch (error) {
      toast.error("Error fetching offers");
      console.error("[v0] Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter((o) => {
    const search = searchTerm.toLowerCase();
    return (
      o.name.toLowerCase().includes(search) ||
      o.couponCode.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredOffers.length / rowsPerPage);
  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      console.log("[v0] Deleting offer:", id);
      const res = await fetch(`/api/admin/offers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOffers((prev) => prev.filter((o) => o._id !== id));
        toast.success("Offer deleted successfully.");
        console.log("[v0] Offer deleted successfully");
      } else {
        toast.error("Failed to delete offer.");
        console.error("[v0] Failed to delete offer");
      }
    } catch (err) {
      toast.error("An error occurred while deleting.");
      console.error("[v0] Error deleting offer:", err);
    }
  };

  const handlePageChange = (dir: "prev" | "next") => {
    if (dir === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (dir === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "expired":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "scheduled":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-800";
    }
  };

  const formatValue = (type: string, value: number) => {
    return type === "percentage" ? `${value}%` : `₹${value}`;
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardContent className="py-10 text-center text-gray-500">
          Loading offers...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
        <div className="grid gap-1 pt-6">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Offers
          </CardTitle>
          <CardDescription className="text-gray-500">
            Manage promotional offers and discounts.{" "}
            {offers.length > 0 && `(${offers.length} total)`}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search offers..."
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
            onClick={() => router.push("/admin/offers/add")}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Offer
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOffers.length > 0 ? (
                paginatedOffers.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell className="font-semibold text-gray-800">
                      {o.name}
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {o.couponCode}
                      </code>
                    </TableCell>
                    <TableCell className="capitalize">{o.type}</TableCell>
                    <TableCell>{formatValue(o.type, o.value)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeVariant(o.status)}>
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {o.usageCount} {o.usageLimit ? `/ ${o.usageLimit}` : ""}
                    </TableCell>
                    <TableCell>
                      {o.expiryDate
                        ? new Date(o.expiryDate).toLocaleDateString()
                        : "No expiry"}
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
                              router.push(`/admin/offers/${o._id}`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(o._id)}
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
                    colSpan={8}
                    className="text-center text-gray-500 py-6"
                  >
                    No offers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
