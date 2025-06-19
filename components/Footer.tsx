"use client";

import type React from "react";

import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  Award,
  Shield,
  Truck,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";

// Modern Input component
function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-12 w-full rounded-xl border-2 border-blue-100 bg-white px-4 py-3 text-sm placeholder:text-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${
        className || ""
      }`}
      {...props}
    />
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 via-white to-orange-50 border-t-4 border-blue-200">
      {/* Trust Indicators */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Free Delivery",
                desc: "On orders above ₹499",
                color: "text-blue-600",
              },
              {
                icon: Shield,
                title: "100% Authentic",
                desc: "Genuine products only",
                color: "text-green-600",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                desc: "Always here to help",
                color: "text-orange-600",
              },
              {
                icon: Award,
                title: "5M+ Happy Pets",
                desc: "Trusted by pet parents",
                color: "text-purple-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-2xl hover:bg-blue-50 transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.color} bg-opacity-10 flex items-center justify-center`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <div className="font-bold text-blue-800">{item.title}</div>
                  <div className="text-sm text-blue-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-105 transition-transform duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-secondary, #f97316) 0%, #ff8c42 100%)",
                }}
              >
                🐾
              </div>
              <div>
                <div
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: "var(--color-primary, #3b82f6)" }}
                >
                  PetPalace
                </div>
                <div className="text-sm text-blue-500 font-medium">
                  Your Pet's Best Friend
                </div>
              </div>
            </div>

            <p className="text-blue-700 leading-relaxed">
              Your one-stop destination for premium pet supplies, nutritious
              food, and fun accessories. We treat your pets like family because
              they deserve nothing but the best! 🐕❤️🐱
            </p>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-bold text-blue-800">Follow Our Journey</h4>
              <div className="flex gap-3">
                {[
                  {
                    icon: Facebook,
                    color: "hover:bg-blue-600",
                    label: "Facebook",
                  },
                  {
                    icon: Twitter,
                    color: "hover:bg-blue-400",
                    label: "Twitter",
                  },
                  {
                    icon: Instagram,
                    color: "hover:bg-pink-500",
                    label: "Instagram",
                  },
                ].map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className={`w-12 h-12 rounded-xl bg-white border-2 border-blue-200 text-blue-600 ${social.color} hover:text-white transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", emoji: "🏢" },
                { name: "Contact", emoji: "📞" },
                { name: "Privacy Policy", emoji: "🔒" },
                { name: "Terms & Conditions", emoji: "📋" },
                { name: "Return Policy", emoji: "↩️" },
                { name: "Track Your Order", emoji: "📦" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-blue-600 hover:text-orange-600 transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    <span>{link.emoji}</span>
                    <span className="font-medium">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Pet Categories
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Dog Supplies", emoji: "🐕", popular: true },
                { name: "Cat Supplies", emoji: "🐱", popular: true },
                { name: "Pet Food & Treats", emoji: "🍖" },
                { name: "Toys & Games", emoji: "🎾" },
                { name: "Health & Medicine", emoji: "💊" },
                { name: "Grooming Essentials", emoji: "✂️" },
              ].map((category, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-blue-600 hover:text-orange-600 transition-colors duration-200 hover:translate-x-1 transform group"
                  >
                    <span>{category.emoji}</span>
                    <span className="font-medium">{category.name}</span>
                    {category.popular && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        HOT
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-500" />
              Get In Touch
            </h3>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  text: "1800-123-4567",
                  subtext: "Toll-free support",
                },
                {
                  icon: Mail,
                  text: "support@petpalace.com",
                  subtext: "24/7 email support",
                },
                {
                  icon: MapPin,
                  text: "Mumbai, India",
                  subtext: "Serving nationwide",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <contact.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">
                      {contact.text}
                    </div>
                    <div className="text-sm text-blue-600">
                      {contact.subtext}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-blue-100 to-orange-100 border border-blue-200">
              <div>
                <h4 className="font-bold text-blue-800 flex items-center gap-2">
                  📧 Pet Care Newsletter
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                  Get tips, offers & pet care advice!
                </p>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button
                  size="lg"
                  className="text-white font-bold px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-secondary, #f97316) 0%, #ff8c42 100%)",
                  }}
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-blue-500">
                🎁 Get 10% off on your first order!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t-2 border-blue-200 py-6"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary, #3b82f6) 0%, var(--color-secondary, #f97316) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white text-center md:text-left">
              <p className="font-semibold">
                © 2024 PetPalace - Made with ❤️ for Pet Parents
              </p>
              <p className="text-sm opacity-90">
                Bringing joy to pets and their families since 2020
              </p>
            </div>
            <div className="flex items-center gap-4 text-white">
              <span className="text-sm opacity-90">Trusted by</span>
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                <span className="font-bold">4.8/5</span>
                <span className="text-sm opacity-90">(50K+ reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Also export as default
export default Footer;
