"use client";

import type React from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCartItemCount } from "@/lib/services/cart-service";

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

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);

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

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartItemCount());
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const topCategories = categories.filter(
    (cat) => !cat.parentId || cat.parentId === ""
  );
  const getSubcategories = (parentId: string) =>
    categories.filter((cat) => cat.parentId === parentId);

  return (
    <header className="sticky top-0 z-[9999]">
      {topbarContent && (
        <div className="bg-orange-500 text-white text-center py-2 px-4 text-sm font-medium">
          {topbarContent}
        </div>
      )}

      <div className="bg-white">
        <div className="container mx-auto px-3 md:px-6 py-3 flex items-center justify-between">
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

          <div className="hidden lg:flex flex-1 max-w-xl mx-6">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Input
                type="text"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 h-12 bg-gray-50 border-2 border-gray-300 rounded-xl focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:shadow-lg transition-all duration-200 text-gray-700 placeholder:text-gray-500"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-sm"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {userExists ? (
              <Link href="/account">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 h-10 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 h-10 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login / Sign Up</span>
                </Button>
              </Link>
            )}

            <Link
              href="/account"
              className="flex items-center gap-1 text-black hover:text-gray-700"
            >
              <Heart className="w-6 h-6" />
              <span className="hidden sm:inline font-medium">Wishlist</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-1 text-black hover:text-gray-700 relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="hidden sm:inline font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden container mx-auto px-3 pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder={placeholderText}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 h-9 bg-gray-50 border-2 border-gray-300 rounded-lg focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:shadow-md text-gray-700 placeholder:text-gray-500 text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <Button
                type="submit"
                size="sm"
                className="h-7 w-7 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm"
              >
                <Search className="h-3 w-3" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 relative">
        <div className="container mx-auto px-6 relative">
          <nav className="flex items-center justify-center gap-6 py-2">
            {topCategories.map((parent) => {
              const subParents = getSubcategories(parent._id);
              const hasDropdown = subParents.length > 0;
              return (
                <div key={parent._id} className="relative group">
                  <Link
                    href={`/categories/${parent.slug}`}
                    className="flex items-center text-gray-800 hover:text-orange-600 font-bold text-lg px-3 py-2 gap-1 transition-all duration-150 rounded-md hover:bg-orange-100"
                  >
                    {parent.name}
                    {hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {hasDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 p-6 min-w-[600px] max-w-[900px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                        {subParents.map((subParent) => {
                          const subcats = getSubcategories(subParent._id);
                          return (
                            <div key={subParent._id} className="min-w-[180px]">
                              <Link
                                href={`/categories/${subParent.slug}`}
                                className="font-bold text-base text-gray-900 hover:text-orange-600 block mb-2 transition-all duration-150"
                              >
                                {subParent.name}
                              </Link>
                              {subcats.map((sub) => (
                                <Link
                                  key={sub._id}
                                  href={`/categories/${sub.slug}`}
                                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 block mb-1 text-base transition-all duration-150 py-0.5 px-1.5 rounded-md"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-white to-orange-50/30 max-h-[70vh] overflow-y-auto">
          <div className="p-4 space-y-2">
            {topCategories.map((parent) => (
              <div key={parent._id}>
                <Link
                  href={`/categories/${parent.slug}`}
                  className="block py-2 text-gray-800 font-semibold hover:text-orange-600 rounded-md px-2 flex justify-between items-center hover:bg-orange-50 transition-all"
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
                    className="block pl-6 py-1 text-gray-600 hover:text-orange-600 text-sm rounded-md px-2 hover:bg-orange-50 transition-all"
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
