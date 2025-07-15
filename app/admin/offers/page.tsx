import { Button } from "@/components/ui/button";
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
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function ManageOffersPage() {
  const offers = [
    {
      id: "offer-001",
      name: "New Customer Discount",
      type: "Percentage",
      value: "15%",
      status: "Active",
    },
    {
      id: "offer-002",
      name: "Summer Sale",
      type: "Fixed Amount",
      value: "$10 off",
      status: "Expired",
    },
    {
      id: "offer-003",
      name: "Free Shipping",
      type: "Shipping",
      value: "Free",
      status: "Active",
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-500 hover:bg-blue-600 text-white"; // Blue
      case "Expired":
        return "bg-red-500 hover:bg-red-600 text-white"; // Red
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-800"; // Default
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="grid gap-1">
          <CardTitle className="text-2xl font-bold">Offers</CardTitle>
          <CardDescription>
            Manage promotional offers and discounts.
          </CardDescription>
        </div>
        {/* Button in orange */}
        <Button
          size="sm"
          className="h-8 gap-1 bg-orange-500 text-white hover:bg-orange-600"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Offer
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-medium">{offer.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {offer.type}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {offer.value}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeVariant(offer.status)}>
                    {offer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Deactivate</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
