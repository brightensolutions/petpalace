"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package2,
  Home,
  LayoutGrid,
  Package,
  Users,
  ShoppingCart,
  Tag,
  Search,
  Image as ImageIcon,
  Flame,
  Video,
  FileText,
  Award,
  Star,
  Heart,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInput,
} from "@/components/ui/sidebar";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // State to track which groups are open
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    main: true,
    inventory: false,
    users: false,
    content: false,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Reusable SidebarGroup with arrow
  const AccordionGroup: React.FC<{
    title: string;
    icon?: React.ReactNode;
    groupKey: string;
    children: React.ReactNode;
  }> = ({ title, groupKey, children }) => {
    const isOpen = openGroups[groupKey];
    return (
      <SidebarGroup>
        <SidebarGroupLabel
          className="flex justify-between items-center text-orange-500 text-lg cursor-pointer px-2 py-1 select-none"
          onClick={() => toggleGroup(groupKey)}
        >
          <span>{title}</span>
          <ChevronDown
            className={`h-4 w-4 text-orange-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </SidebarGroupLabel>
        {isOpen && <SidebarGroupContent>{children}</SidebarGroupContent>}
      </SidebarGroup>
    );
  };

  return (
    <Sidebar {...props} className="text-gray-800 shadow-md bg-white">
      {/* Top Header */}
      <SidebarHeader className="flex items-center justify-between px-6 py-4 bg-orange-500 text-white">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6 text-orange-400" />
          <span className="text-xl text-orange-100">PetPalace Admin</span>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="bg-gradient-to-b from-white via-orange-50 to-blue-50">
        {/* Search Bar */}
        <SidebarGroup>
          <SidebarGroupContent className="relative p-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 select-none opacity-50 text-gray-400" />
            <SidebarInput
              id="search"
              placeholder="Search..."
              className="pl-10 border-orange-300 focus:ring-orange-400 text-base"
            />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <AccordionGroup title="Main Navigation" groupKey="main">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Home className="text-orange-500" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </AccordionGroup>

        {/* Inventory Management */}
        <AccordionGroup title="Inventory Management" groupKey="inventory">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/categories"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <LayoutGrid className="text-orange-500" />
                  <span>Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/brands"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Award className="text-orange-500" />
                  <span>Brands</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/products"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Package className="text-orange-500" />
                  <span>Products</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/stock"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Flame className="text-orange-500" />
                  <span>Stock</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/offers"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Tag className="text-orange-500" />
                  <span>Offers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <ShoppingCart className="text-orange-500" />
                  <span>Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/reports"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <FileText className="text-orange-500" />
                  <span>Reports</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </AccordionGroup>

        {/* User Management */}
        <AccordionGroup title="User Management" groupKey="users">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Users className="text-orange-500" />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/carts"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <ShoppingCart className="text-orange-500" />
                  <span>Cart</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/wishlists"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Heart className="text-orange-500" />
                  <span>Wishlist</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </AccordionGroup>

        {/* Content Management */}
        <AccordionGroup title="Content Management" groupKey="content">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/topbar-content"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <LayoutGrid className="text-orange-500" />
                  <span>Topbar Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/sliders"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <ImageIcon className="text-orange-500" />
                  <span>Sliders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/trending-categories"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Flame className="text-orange-500" />
                  <span>Trending Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/best-sellers"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Star className="text-orange-500" />
                  <span>Best Seller</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/abhi-nahi-to-kabhi-nahi-products"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Tag className="text-orange-500" />
                  <span>Abhi Nahi to Kabhi Nahi Products</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/reviews"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Star className="text-orange-500" />
                  <span>Reviews</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/videos"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <Video className="text-orange-500" />
                  <span>Videos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/admin/blogs"
                  className="flex items-center gap-2 hover:text-orange-600 text-base"
                >
                  <FileText className="text-orange-500" />
                  <span>Blogs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </AccordionGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
