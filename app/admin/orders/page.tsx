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
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function ManageOrdersPage() {
  const orders = [
    {
      id: "#PP1001",
      customer: "Alice Smith",
      date: "2023-10-26",
      total: 75.5,
      status: "Processing",
    },
    {
      id: "#PP1002",
      customer: "Bob Johnson",
      date: "2023-10-25",
      total: 120.0,
      status: "Shipped",
    },
    {
      id: "#PP1003",
      customer: "Charlie Brown",
      date: "2023-10-24",
      total: 30.25,
      status: "Delivered",
    },
    {
      id: "#PP1004",
      customer: "Diana Prince",
      date: "2023-10-23",
      total: 200.0,
      status: "Cancelled",
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Processing":
        return "secondary"; // Orange
      case "Shipped":
        return "default"; // Blue
      case "Delivered":
        return "default"; // Blue
      case "Cancelled":
        return "destructive"; // Red
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="grid gap-1">
          <CardTitle className="text-2xl font-bold">Orders</CardTitle>
          <CardDescription>Manage customer orders.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {order.date}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Refund</DropdownMenuItem>
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
