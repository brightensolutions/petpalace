"use client";

import type * as React from "react";
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
import { Button } from "@/components/ui/button";

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="text-gray-800 shadow-md bg-white">
      {/* Top Header - Solid Orange Background */}
      <SidebarHeader className="flex items-center justify-between px-6 py-4 bg-orange-500 text-white">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6 text-orange-400" />
          <span className="text-xl text-orange-100">PetPalace Admin</span>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="bg-gradient-to-b from-white via-orange-50 to-blue-50">
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
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-500 text-lg">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-500 text-lg">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
                    href="/admin/orders"
                    className="flex items-center gap-2 hover:text-orange-600 text-base"
                  >
                    <ShoppingCart className="text-orange-500" />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
