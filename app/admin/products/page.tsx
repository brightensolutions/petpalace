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
import Image from "next/image";

export default function ManageProductsPage() {
  const products = [
    {
      id: "prod-001",
      name: "Premium Dog Kibble",
      category: "Dog Food",
      stock: 150,
      price: 49.99,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "prod-002",
      name: "Feather Teaser Wand",
      category: "Cat Toys",
      stock: 75,
      price: 12.5,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "prod-003",
      name: "Large Bird Cage",
      category: "Bird Cages",
      stock: 20,
      price: 199.0,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "prod-004",
      name: "10 Gallon Fish Tank",
      category: "Fish Tanks",
      stock: 30,
      price: 75.0,
      image: "/placeholder.svg?height=64&width=64",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="grid gap-1">
          <CardTitle className="text-2xl font-bold">Products</CardTitle>
          <CardDescription>
            Manage your products, including stock and variants.
          </CardDescription>
        </div>
        <Button
          size="sm"
          className="h-8 gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Product
          </span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[64px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.image || "/placeholder.svg"}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.stock}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  ${product.price.toFixed(2)}
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
                      <DropdownMenuItem>Manage Variants</DropdownMenuItem>
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
