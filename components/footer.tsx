"use client";
import Image from "next/image";

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
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Free Delivery",
                desc: "On orders above Rs.499",
                color: "text-blue-600",
                bgColor: "bg-blue-100",
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
                color: "text-blue-600",
                bgColor: "bg-blue-100",
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
                className="flex items-center gap-3 p-4 rounded-2xl bg-white hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">
                    {item.title}
                  </div>
                  <div className="text-base text-gray-600">{item.desc}</div>
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
              <Image
                src="/images/logo.png"
                alt="PetPalace Logo"
                width={200}
                height={80}
                className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>

            <p className="text-gray-600 leading-relaxed text-base">
              Your one-stop destination for premium pet supplies, nutritious
              food, and fun accessories. We treat your pets like family because
              they deserve nothing but the best!
            </p>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-lg">
                Follow Our Journey
              </h4>
              <div className="flex gap-3">
                {[
                  {
                    icon: Facebook,
                    color: "hover:bg-blue-600",
                    label: "Facebook",
                  },
                  {
                    icon: Twitter,
                    color: "hover:bg-blue-500",
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
                    className={`w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 ${social.color} hover:text-white transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md`}
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
            <h3 className="text-2xl font-bold text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us" },
                { name: "Contact" },
                { name: "Privacy Policy" },
                { name: "Terms & Conditions" },
                { name: "Return Policy" },
                { name: "Track Your Order" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-base text-gray-600 hover:text-orange-600 transition-colors duration-200 hover:translate-x-1 transform font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Pet Categories</h3>
            <ul className="space-y-3">
              {[
                { name: "Cats", popular: true },
                { name: "Dogs", popular: true },
                { name: "Pharmacy" },
                { name: "Shop by brand" },
                { name: "Pet Consultation" },
              ].map((category, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-base text-gray-600 hover:text-orange-600 transition-colors duration-200 hover:translate-x-1 transform group"
                  >
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

          {/* Contact Info Only */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Get In Touch</h3>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  text: "1800-123-4567",
                  subtext: "Toll-free support",
                  color: "text-blue-600",
                  bgColor: "bg-blue-100",
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
                  color: "text-blue-600",
                  bgColor: "bg-blue-100",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${contact.bgColor} flex items-center justify-center`}
                  >
                    <contact.icon className={`w-5 h-5 ${contact.color}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-base">
                      {contact.text}
                    </div>
                    <div className="text-base text-gray-600">
                      {contact.subtext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simple Copyright Section */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2024 PetPalace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
