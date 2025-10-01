"use client";

import { Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string;
}

export function Header() {
  const [userExists, setUserExists] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topbarContent, setTopbarContent] = useState<string>("");

  const [placeholderText, setPlaceholderText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const placeholders = useMemo(
    () => [
      "Search for premium pet products...",
      "Find toys for your furry friends...",
      "Discover healthy pet food...",
      "Shop grooming essentials...",
      "Browse pet accessories...",
    ],
    []
  );

  // Typing animation for search input placeholder
  const updatePlaceholder = useCallback(() => {
    const currentText = placeholders[currentIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (placeholderText.length < currentText.length) {
            setPlaceholderText(
              currentText.slice(0, placeholderText.length + 1)
            );
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (placeholderText.length > 0) {
            setPlaceholderText(placeholderText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % placeholders.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [placeholderText, currentIndex, isDeleting, placeholders]);

  useEffect(() => updatePlaceholder(), [updatePlaceholder]);

  // Fetch authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUserExists(data.authenticated === true);
      } catch {
        setUserExists(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
        else if (data.success && Array.isArray(data.data))
          setCategories(data.data);
        else setCategories([]);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTopbar = async () => {
      try {
        const res = await fetch("/api/topbar-content");
        const data = await res.json();
        setTopbarContent(data.content || "");
      } catch {
        setTopbarContent("");
      }
    };
    fetchTopbar();
  }, []);

  // Filter top-level categories
  const topCategories = categories.filter(
    (cat) => !cat.parentId || cat.parentId === ""
  );

  const getSubcategories = (parentId: string) =>
    categories.filter((cat) => cat.parentId === parentId);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[9999]">
      {/* Topbar Banner */}
      {topbarContent && (
        <div className="bg-orange-500 text-white text-center py-2 px-4 text-sm">
          {topbarContent}
        </div>
      )}

      {/* Main Header */}
      <div className="container mx-auto px-3 md:px-6 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-start w-28 sm:w-40 lg:w-64">
            <Link href="/" className="block">
              <Image
                src="/images/logo.png"
                alt="PetPalace Logo"
                width={620}
                height={206}
                className="h-10 sm:h-12 lg:h-16 w-full object-contain hover:opacity-90 transition-opacity duration-200 cursor-pointer"
              />
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg lg:max-w-xl mx-2 sm:mx-4 lg:mx-6">
            <div className="relative group">
              <Input
                type="text"
                placeholder={placeholderText}
                className="pl-3 sm:pl-4 pr-10 sm:pr-12 h-8 sm:h-10 lg:h-12 bg-gray-50 border-0 rounded-lg lg:rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg transition-all duration-200 text-gray-700 placeholder:text-gray-700 text-xs sm:text-sm lg:text-base"
              />
              <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
                <Button
                  size="sm"
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-md lg:rounded-lg shadow-sm"
                >
                  <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-1 lg:gap-2">
            {userExists ? (
              <Link href="/account">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 rounded-md lg:rounded-lg font-semibold text-xs lg:text-sm shadow-lg hover:shadow-xl transition-all duration-200 h-8 sm:h-10 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 rounded-md lg:rounded-lg font-semibold text-xs lg:text-sm shadow-lg hover:shadow-xl transition-all duration-200 h-8 sm:h-10 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="hidden sm:inline">Login / Sign Up</span>
                </Button>
              </Link>
            )}

            {/* Cart */}
            <div className="relative">
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-md lg:rounded-lg border-2 border-gray-200 hover:border-blue-300 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 hover:text-blue-600" />
                </Button>
              </Link>
              <Badge className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full p-0 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-lg">
                2
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      <div className="hidden lg:block border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white shadow-sm relative">
        <div className="container mx-auto px-6 relative">
          <nav className="flex items-center justify-center gap-6 py-2">
            {topCategories.map((parent) => {
              const subParents = getSubcategories(parent._id);
              return (
                <div key={parent._id} className="relative group">
                  <Link
                    href={`/categories/${parent.slug}`}
                    className="text-gray-800 hover:text-blue-600 font-bold text-base px-3 py-2"
                  >
                    {parent.name}
                  </Link>

                  {subParents.length > 0 && (
                    <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 p-4 w-[600px] grid grid-cols-2 gap-4">
                      {subParents.map((subParent) => {
                        const subcats = getSubcategories(subParent._id);
                        return (
                          <div key={subParent._id}>
                            <Link
                              href={`/categories/${subParent.slug}`}
                              className="font-semibold text-gray-800 hover:text-blue-600 block mb-2"
                            >
                              {subParent.name}
                            </Link>
                            {subcats.map((sub) => (
                              <Link
                                key={sub._id}
                                href={`/categories/${sub.slug}`}
                                className="text-gray-600 hover:text-blue-500 block ml-3 mb-1 text-sm"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
