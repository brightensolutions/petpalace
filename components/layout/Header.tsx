"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  User,
  ShoppingCart,
  Heart,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [wishlistCount] = useState(2);

  const categories = [
    { name: "Dogs", href: "/products/dogs", hasSubmenu: true },
    { name: "Cats", href: "/products/cats", hasSubmenu: true },
    { name: "Health", href: "/products/health", badge: "Trending" },
    { name: "Pharmacy", href: "/products/pharmacy", hasSubmenu: true },
    { name: "Shop By Breed", href: "/products/breed", hasSubmenu: true },
    { name: "Consult a Vet", href: "/consult" },
    { name: "Pet Clinic", href: "/clinic", badge: "New" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between py-3 lg:py-4 border-b border-gray-200">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Pet Palace - The Kingdom of Royal Pets"
              width={160}
              height={50}
              className="h-8 sm:h-10 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for pet supplies..."
                className="w-full pl-4 pr-12 py-3 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:ring-0"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1 bottom-1 px-4 bg-orange-500 hover:bg-orange-600 rounded-full"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Location - Hidden on mobile */}
            <div className="hidden xl:flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="whitespace-nowrap">Enter pincode</span>
            </div>

            {/* Contact - Hidden on small screens */}
            <div className="hidden sm:block">
              <Phone className="w-5 h-5 text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />
            </div>

            {/* User Account */}
            <Link href="/account" className="hidden sm:block">
              <User className="w-5 h-5 text-gray-600 hover:text-orange-500 transition-colors" />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <Heart className="w-5 h-5 text-gray-600 hover:text-orange-500 transition-colors" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                  {wishlistCount}
                </Badge>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-orange-500 transition-colors" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile when menu is closed */}
        <div className="lg:hidden py-3 border-b border-gray-200">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for pet supplies..."
              className="w-full pl-4 pr-12 py-3 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:ring-0"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1 bottom-1 px-4 bg-orange-500 hover:bg-orange-600 rounded-full"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:block">
          <div className="bg-black text-white -mx-4 px-4">
            <div className="flex items-center space-x-8 py-4">
              {categories.map((category) => (
                <div key={category.name} className="relative group">
                  <Link
                    href={category.href}
                    className="flex items-center space-x-1 hover:text-orange-500 transition-colors whitespace-nowrap"
                  >
                    <span>{category.name}</span>
                    {category.hasSubmenu && <ChevronDown className="w-4 h-4" />}
                    {category.badge && (
                      <Badge className="bg-orange-500 text-white text-xs px-2 py-1 ml-2">
                        {category.badge}
                      </Badge>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t border-gray-200">
            <div className="py-4 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{category.name}</span>
                    {category.badge && (
                      <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
                        {category.badge}
                      </Badge>
                    )}
                  </div>
                  {category.hasSubmenu && (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </Link>
              ))}

              {/* Mobile-only links */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  href="/account"
                  className="flex items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-3 text-gray-600" />
                  <span>My Account</span>
                </Link>
                <div className="flex items-center py-3 px-4 text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                  <span>Enter pincode to check delivery</span>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
