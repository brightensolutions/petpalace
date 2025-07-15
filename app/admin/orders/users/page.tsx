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

export default function ManageUsersPage() {
  const users = [
    {
      id: "user-001",
      name: "Alice Smith",
      email: "alice@example.com",
      role: "Customer",
      status: "Active",
    },
    {
      id: "user-002",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Customer",
      status: "Active",
    },
    {
      id: "user-003",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: "user-004",
      name: "Diana Prince",
      email: "diana@example.com",
      role: "Customer",
      status: "Inactive",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="grid gap-1">
          <CardTitle className="text-2xl font-bold">Users</CardTitle>
          <CardDescription>Manage your website users.</CardDescription>
        </div>
        <Button
          size="sm"
          className="h-8 gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add User
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.role}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.status}
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
                      <DropdownMenuItem>Edit Role</DropdownMenuItem>
                      <DropdownMenuItem>Deactivate</DropdownMenuItem>
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
