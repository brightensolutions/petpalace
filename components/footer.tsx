"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Award,
  Shield,
  Truck,
  Clock,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
}

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await res.json();

        const parentCategories = data.filter((cat) => !cat.parentId);
        setCategories(parentCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: Truck,
                title: "Free Delivery",
                desc: "On orders above Rs.499",
                color: "text-[#3b82f6]", // themed blue
                bgColor: "bg-[#dbeafe]", // themed blue background
              },
              {
                icon: Shield,
                title: "100% Authentic",
                desc: "Genuine products only",
                color: "text-orange-600",
                bgColor: "bg-orange-100",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                desc: "Always here to help",
                color: "text-[#3b82f6]",
                bgColor: "bg-[#dbeafe]",
              },
              {
                icon: Award,
                title: "5M+ Happy Pets",
                desc: "Trusted by pet parents",
                color: "text-orange-600",
                bgColor: "bg-orange-100",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}
                >
                  <item.icon
                    className={`w-4 h-4 sm:w-6 sm:h-6 ${item.color}`}
                  />
                </div>
                <div className="text-sm sm:text-base">
                  <div className="font-bold text-gray-900">{item.title}</div>
                  <div className="text-gray-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <Image
                src="/images/logo.png"
                alt="PetPalace Logo"
                width={160}
                height={60}
                className="h-12 sm:h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Your one-stop destination for premium pet supplies, nutritious
              food, and fun accessories. We treat your pets like family!
            </p>
            {/* Social Media */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                Follow Our Journey
              </h4>
              <div className="flex gap-2 sm:gap-3">
                {[
                  {
                    icon: Facebook,
                    color: "hover:bg-[#3b82f6]",
                    label: "Facebook",
                  },
                  {
                    icon: Twitter,
                    color: "hover:bg-[#3b82f6]",
                    label: "Twitter",
                  },
                  {
                    icon: Instagram,
                    color: "hover:bg-orange-500",
                    label: "Instagram",
                  },
                ].map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 ${social.color} hover:text-white transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms & Conditions", href: "/terms-and-conditions" },
                {
                  name: "Cancellation & Refund Policy",
                  href: "/cancellation-refund-policy",
                },
                { name: "Shipping Policy", href: "/shipping-policy" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm sm:text-base text-gray-600 hover:text-orange-600 transition-colors duration-200 hover:translate-x-1 transform font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Parent Categories */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Pet Categories
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <li
                    key={i}
                    className="h-4 w-32 sm:w-40 bg-gray-200 rounded animate-pulse"
                  />
                ))
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category._id}>
                    <a
                      href={`/categories/${category.slug || category._id}`}
                      className="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-[#3b82f6] transition-colors duration-200 hover:translate-x-1 transform group"
                    >
                      {category.name}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">
                  No categories available
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Get In Touch
            </h3>
            <div className="space-y-2 sm:space-y-4">
              {[
                {
                  icon: Phone,
                  text: "1800-123-4567",
                  subtext: "Toll-free support",
                  color: "text-[#3b82f6]",
                  bgColor: "bg-[#dbeafe]",
                },
                {
                  icon: Mail,
                  text: "support@petpalace.com",
                  subtext: "24/7 email support",
                  color: "text-orange-600",
                  bgColor: "bg-orange-100",
                },
                {
                  icon: MapPin,
                  text: "Surat, Gujarat",
                  subtext: "Serving nationwide",
                  color: "text-[#3b82f6]",
                  bgColor: "bg-[#dbeafe]",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 sm:p-3 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${contact.bgColor} flex items-center justify-center`}
                  >
                    <contact.icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${contact.color}`}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {contact.text}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      {contact.subtext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              © 2024 PetPalace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
