"use client";

import type React from "react";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    setIsClient(true);

    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");
    const email =
      localStorage.getItem("adminEmail") ||
      sessionStorage.getItem("adminEmail");

    if (!token && pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    } else if (email) {
      setAdminEmail(email);
    }
  }, [pathname]);

  if (!isClient) return null;

  // Show only the children for the login page, without header/sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminEmail");
    window.location.href = "/admin/login";
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarProvider>
        <DashboardSidebar collapsible="offcanvas" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-gradient-to-r from-white via-orange-50 to-blue-50 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/admin"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Avatar / Dropdown */}
            <div className="ml-auto flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border w-8 h-8"
                  >
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      width={32}
                      height={32}
                      className="rounded-full"
                      alt="Avatar"
                    />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {adminEmail || "My Account"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content */}
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
