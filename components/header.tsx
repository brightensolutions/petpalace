"use client";
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
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

  useEffect(() => {
    return updatePlaceholder();
  }, [updatePlaceholder]);

  return (
    <header className="bg-white shadow-sm">
      {/* Top Banner with Orange Gradient */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 text-center text-base font-medium">
        Special Offer: Free delivery + 20% OFF on your first order above ₹999
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side with Container and Homepage Link */}
          <div className="flex items-center justify-start w-80">
            <Link href="/" className="block">
              <Image
                src="/images/logo.png"
                alt="PetPalace Logo"
                width={620}
                height={206}
                className="h-24 w-full max-w-sm object-contain hover:opacity-90 transition-opacity duration-200 cursor-pointer"
              />
            </Link>
          </div>

          {/* Enhanced Search Bar - Center */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <Input
                type="text"
                placeholder={placeholderText}
                className="pl-6 pr-16 h-14 bg-gray-50 border-0 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg transition-all duration-200 text-gray-700 placeholder:text-gray-700 text-xl"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <Button
                  size="sm"
                  className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Modern Action Buttons - Right Side - Smaller Padding */}
          <div className="flex items-center gap-3">
            {/* Location - Compact Card Style */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 h-12">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-gray-500 text-sm font-medium">
                  Deliver to
                </div>
                <div className="font-semibold text-gray-800 text-base">
                  110001
                </div>
              </div>
            </div>

            {/* Sign In Button - Compact Style */}
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 h-12 flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                Sign In
              </Button>
            </Link>

            {/* Cart - Compact Card Style */}
            <div className="relative">
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors" />
                </Button>
              </Link>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-lg">
                2
              </Badge>
            </div>

            {/* Mobile Menu - Compact Style */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden w-12 h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Menu className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="relative">
                    <Input
                      placeholder="Search products..."
                      className="pl-6 pr-16 rounded-xl h-12 text-base"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                      <Button size="sm" className="h-8 w-8 p-0 rounded-lg">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Dogs",
                      "Cats",
                      "Small Animals",
                      "Pet Hub",
                      "Store Locator",
                      "Fresh Meals",
                    ].map((item) => (
                      <Button
                        key={item}
                        variant="ghost"
                        className="w-full justify-start rounded-xl text-base font-medium py-4"
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Premium Navigation Menu */}
      <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-center gap-1 py-2">
            {[
              {
                name: "Dogs",
                hasDropdown: true,
                items: [
                  "Dog Food",
                  "Dog Toys",
                  "Dog Treats",
                  "Dog Accessories",
                  "Dog Health",
                  "Dog Grooming",
                ],
              },
              {
                name: "Cats",
                hasDropdown: true,
                items: [
                  "Cat Food",
                  "Cat Toys",
                  "Cat Treats",
                  "Cat Accessories",
                  "Cat Health",
                  "Cat Grooming",
                ],
              },
              {
                name: "Small Animals",
                hasDropdown: true,
                items: [
                  "Bird Food",
                  "Fish Food",
                  "Rabbit Food",
                  "Hamster Food",
                  "Small Pet Toys",
                ],
              },
              {
                name: "Pet Hub",
                hasDropdown: true,
                items: [
                  "Pet Care Tips",
                  "Training Guides",
                  "Health Articles",
                  "Nutrition Advice",
                ],
              },
              { name: "Store Locator", hasDropdown: false },
              { name: "Fresh Meals", hasDropdown: false },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 hover:bg-transparent font-semibold text-base px-8 py-4 rounded-xl transition-colors duration-200 flex items-center gap-2"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className="w-5 h-5 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Button>

                {/* Professional Dropdown Menu */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-6">
                      <div className="grid gap-0">
                        {item.items?.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href="/categories/dog-food" // TODO: Replace with dynamic subItem path if needed
                            className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-base"
                          >
                            {subItem}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link
                          href="/categories/dog-food" // TODO: Replace with dynamic path if needed
                          className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-base"
                        >
                          View All {item.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
