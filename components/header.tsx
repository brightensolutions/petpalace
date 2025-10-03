"use client";

import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
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

  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };
    fetchTopbar();
  }, []);

  const topCategories = categories.filter(
    (cat) => !cat.parentId || cat.parentId === ""
  );
  const getSubcategories = (parentId: string) =>
    categories.filter((cat) => cat.parentId === parentId);

  return (
    <header className="sticky top-0 z-[9999] shadow-md">
      {/* Topbar */}
      {topbarContent && (
        <div className="bg-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
          {topbarContent}
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white">
        <div className="container mx-auto px-3 md:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center w-28 sm:w-40 lg:w-64">
            <Link
              href="/"
              className="block hover:opacity-90 transition-opacity duration-200"
            >
              <Image
                src="/images/logo.png"
                alt="PetPalace Logo"
                width={620}
                height={206}
                className="h-10 sm:h-12 lg:h-16 w-full object-contain cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full group">
              <Input
                type="text"
                placeholder={placeholderText}
                className="pl-4 pr-12 h-12 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-400 focus:shadow-lg transition-all duration-200 text-gray-700 placeholder:text-gray-500"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-all"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Account */}
            {userExists ? (
              <Link href="/account">
                <Button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 h-10 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 h-10 flex items-center gap-1">
                  <User className="w-4 h-4" />
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
                  className="w-10 h-10 rounded-lg border-2 border-blue-300 hover:border-blue-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ShoppingCart className="w-4 h-4 text-gray-700 hover:text-blue-600" />
                </Button>
              </Link>
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-lg">
                2
              </Badge>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden container mx-auto px-3 pb-3">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder={placeholderText}
              className="pl-4 pr-10 h-9 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-400 focus:shadow-md text-gray-700 placeholder:text-gray-500 text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <Button
                size="sm"
                className="h-7 w-7 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm"
              >
                <Search className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      <div className="hidden lg:block border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white shadow-sm relative">
        <div className="container mx-auto px-6 relative">
          <nav className="flex items-center justify-center gap-6 py-2">
            {topCategories.map((parent) => {
              const subParents = getSubcategories(parent._id);
              const hasDropdown = subParents.length > 0;
              return (
                <div key={parent._id} className="relative group">
                  <Link
                    href={`/categories/${parent.slug}`}
                    className="flex items-center text-gray-800 hover:text-blue-600 font-bold text-base px-3 py-2 gap-1 transition-all duration-150"
                  >
                    {parent.name}
                    {hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {hasDropdown && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 p-4 flex gap-6 w-[max-content] overflow-x-auto flex-nowrap md:flex-wrap">
                      {subParents.map((subParent) => {
                        const subcats = getSubcategories(subParent._id);
                        return (
                          <div key={subParent._id} className="min-w-[150px]">
                            <Link
                              href={`/categories/${subParent.slug}`}
                              className="font-semibold text-gray-800 hover:text-blue-600 block mb-2 transition-all duration-150"
                            >
                              {subParent.name}
                            </Link>
                            {subcats.map((sub) => (
                              <Link
                                key={sub._id}
                                href={`/categories/${sub.slug}`}
                                className="text-gray-600 hover:text-blue-500 block mb-1 text-sm transition-all duration-150"
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

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-md">
          <div className="p-4 space-y-2">
            {topCategories.map((parent) => (
              <div key={parent._id}>
                <Link
                  href={`/categories/${parent.slug}`}
                  className="block py-2 text-gray-800 font-semibold hover:text-blue-600 rounded-md px-2 flex justify-between items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  {parent.name}
                  {getSubcategories(parent._id).length > 0 && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Link>
                {getSubcategories(parent._id).map((sub) => (
                  <Link
                    key={sub._id}
                    href={`/categories/${sub.slug}`}
                    className="block pl-6 py-1 text-gray-600 hover:text-blue-500 text-sm rounded-md px-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
