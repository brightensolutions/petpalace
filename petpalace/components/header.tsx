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

  const menuData = {
    Cats: {
      "CAT FOOD": ["Dry Food", "Wet Food", "Kitten Food", "Premium Food"],
      "CAT LITTER": [
        "Litter",
        "Litter Boxes & Toilets",
        "Cleaning & Deodorizers",
        "Scooper & Waste Disposal",
        "Scented Litter",
        "Unscented Litter",
      ],
      "CAT TOYS": [
        "Cat Teasers",
        "Ball & Chaser Toys",
        "Catnip Toys",
        "Plush Toys",
        "Cat Trees & Scratchers",
        "Smart & Interactive Toys",
      ],
      "CAT GROOMING": [
        "Shampoos & Conditioners",
        "Brushes & Combs",
        "Paw & Nail Care",
        "Ear & Eye Care",
        "Trimmers & Nail Clippers",
        "Grooming Tools",
      ],
      "CAT CLOTHING": [
        "Raincoats",
        "Bells & Tags",
        "Dresses",
        "T-shirts & Shirts",
        "Bandanas & Bowties",
        "Jackets & Sweaters",
      ],
      "CAT ACCESSORIES": [
        "GPS Tracker",
        "Collars",
        "Leashes",
        "Harnesses",
        "Carriers & Travel",
        "Beds & Furniture",
      ],
    },
    Dogs: {
      "DOG FOOD": [
        "Dry Food",
        "Wet Food",
        "Puppy Food",
        "Premium Food",
        "Senior Dog Food",
        "Grain Free Food",
      ],
      "DOG TREATS": [
        "Training Treats",
        "Dental Treats",
        "Natural Treats",
        "Biscuits & Cookies",
        "Jerky Treats",
        "Bones & Chews",
      ],
      "DOG TOYS": [
        "Rope Toys",
        "Ball Toys",
        "Squeaky Toys",
        "Puzzle Toys",
        "Plush Toys",
        "Interactive Toys",
      ],
      "DOG GROOMING": [
        "Shampoos & Conditioners",
        "Brushes & Combs",
        "Nail Clippers",
        "Ear Care",
        "Dental Care",
        "Grooming Tools",
      ],
      "DOG CLOTHING": [
        "Sweaters & Hoodies",
        "Raincoats",
        "Bandanas",
        "Costumes",
        "Boots & Shoes",
        "Jackets",
      ],
      "DOG ACCESSORIES": [
        "Leashes & Collars",
        "Harnesses",
        "ID Tags",
        "Travel Carriers",
        "Dog Beds",
        "Bowls & Feeders",
      ],
    },
    "Other Pets": {
      BIRDS: ["Bird Food", "Bird Cages", "Bird Toys", "Bird Treats"],
      FISH: [
        "Fish Food",
        "Aquarium Supplies",
        "Fish Tank Accessories",
        "Water Care",
      ],
      "SMALL ANIMALS": [
        "Rabbit Food",
        "Hamster Food",
        "Guinea Pig Supplies",
        "Small Pet Toys",
      ],
      REPTILES: [
        "Reptile Food",
        "Terrariums",
        "Heating & Lighting",
        "Reptile Accessories",
      ],
    },
    Pharmacy: {
      "HEALTH CARE": [
        "Vitamins & Supplements",
        "Flea & Tick Control",
        "Dental Care",
        "Joint Care",
      ],
      PRESCRIPTION: [
        "Prescription Medicines",
        "Vet Prescribed Items",
        "Medical Supplies",
      ],
      WELLNESS: [
        "Digestive Health",
        "Skin Care",
        "Eye & Ear Care",
        "Calming Aids",
      ],
    },
    "Shop by Brand": {
      "PREMIUM BRANDS": [
        "Royal Canin",
        "Hills",
        "Purina Pro Plan",
        "Orijen",
        "Acana",
        "Farmina",
      ],
      "POPULAR BRANDS": [
        "Pedigree",
        "Whiskas",
        "Drools",
        "Sheba",
        "Felix",
        "Me-O",
      ],
      "SPECIALTY BRANDS": [
        "Blue Buffalo",
        "Wellness",
        "Taste of the Wild",
        "Canidae",
      ],
    },
    "Pet Consultation": {
      "VET SERVICES": [
        "Online Consultation",
        "Health Check-up",
        "Vaccination Guidance",
        "Emergency Care",
      ],
      TRAINING: [
        "Behavior Training",
        "Obedience Training",
        "Puppy Training",
        "Cat Training",
      ],
      GROOMING: [
        "Professional Grooming",
        "Mobile Grooming",
        "Grooming Tips",
        "Nail Trimming",
      ],
    },
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[9999]">
      {/* Top Banner with Orange Gradient */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-1 md:py-2 px-2 md:px-4 text-center text-xs md:text-sm font-medium">
        <span className="hidden sm:inline">
          Special Offer: Free delivery + 20% OFF on your first order above ₹999
        </span>
        <span className="sm:hidden">Free delivery + 20% OFF above ₹999</span>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-3 md:px-6 py-1">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
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

          {/* Enhanced Search Bar - Center */}
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

          {/* Modern Action Buttons - Right Side */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Location - Hidden on mobile and small tablets */}
            <div className="hidden xl:flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 h-10">
              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                <MapPin className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <div className="text-gray-500 text-xs font-medium">
                  Deliver to
                </div>
                <div className="font-semibold text-gray-800 text-sm">
                  110001
                </div>
              </div>
            </div>

            {/* Sign In Button - Responsive */}
            <Link href="/sign-in">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-2 sm:px-3 py-1 rounded-md lg:rounded-lg font-semibold text-xs lg:text-sm shadow-lg hover:shadow-xl transition-all duration-200 h-8 sm:h-10 flex items-center gap-1">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-sm lg:rounded-md flex items-center justify-center">
                  <User className="w-2 h-2 sm:w-3 sm:h-3" />
                </div>
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>

            {/* Cart - Responsive */}
            <div className="relative">
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-md lg:rounded-lg border-2 border-gray-200 hover:border-blue-300 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 hover:text-blue-600 transition-colors" />
                </Button>
              </Link>
              <Badge className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full p-0 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold shadow-lg">
                2
              </Badge>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-md lg:rounded-lg border-2 border-gray-200 hover:border-blue-300 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Menu className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 hover:text-blue-600 transition-colors" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
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
                    {Object.keys(menuData).map((item) => (
                      <Button
                        key={item}
                        variant="ghost"
                        className="w-full justify-start rounded-xl text-base font-medium py-4"
                      >
                        {item}
                        {item === "Pharmacy" && (
                          <Badge className="ml-2 bg-orange-500 text-white text-xs px-2 py-1">
                            Upcoming
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Premium Navigation Menu - Hidden on mobile */}
      <div className="hidden lg:block border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white shadow-sm relative">
        <div className="container mx-auto px-6 relative">
          <nav className="flex items-center justify-center gap-3 xl:gap-6 py-2">
            {Object.entries(menuData).map(([menuName, categories]) => (
              <div key={menuName} className="relative group flex-shrink-0">
                <Button
                  variant="ghost"
                  className="text-gray-800 hover:text-blue-600 hover:bg-transparent font-bold text-sm xl:text-base px-2 xl:px-3 py-3 rounded-lg transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
                >
                  {menuName}
                  {menuName === "Pharmacy" && (
                    <Badge className="ml-1 bg-orange-500 text-white text-xs px-2 py-0.5">
                      Upcoming
                    </Badge>
                  )}
                  {menuName !== "Pet Consultation" && (
                    <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Button>

                {/* Mega Menu Dropdown */}
                {menuName !== "Pet Consultation" && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 z-[9999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <div
                      className={`${
                        menuName === "Cats" || menuName === "Dogs"
                          ? "w-[800px]"
                          : "w-[600px]"
                      } px-5 py-4`}
                    >
                      <div
                        className={`grid gap-4 ${
                          menuName === "Cats" || menuName === "Dogs"
                            ? "grid-cols-3"
                            : "grid-cols-2"
                        }`}
                      >
                        {Object.entries(categories).map(
                          ([categoryName, items]) => (
                            <div key={categoryName} className="space-y-2">
                              <h3 className="font-bold text-sm text-black uppercase tracking-wide border-b border-gray-200 pb-1">
                                {categoryName}
                              </h3>
                              <div className="space-y-0.5">
                                {items.map((item, itemIndex) => {
                                  const slug = [
                                    menuName.toLowerCase(),
                                    categoryName
                                      .toLowerCase()
                                      .replace(/\s+/g, "-"),
                                    item.toLowerCase().replace(/\s+/g, "-"),
                                  ].join("/");

                                  return (
                                    <Link
                                      key={itemIndex}
                                      href={`/categories/${slug}`}
                                      className="block text-sm text-black px-1 py-0.5 hover:text-blue-600 transition-colors"
                                    >
                                      {item}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        )}
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
