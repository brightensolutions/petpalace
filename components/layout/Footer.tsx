import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "All Products", href: "/products" },
    { name: "Consult a Vet", href: "/consult" },
    { name: "Pet Clinic", href: "/clinic" },
  ];

  const customerCare = [
    { name: "Shipping Info", href: "/policies/shipping" },
    { name: "Returns & Refunds", href: "/policies/returns" },
    { name: "Terms & Conditions", href: "/policies/terms" },
    { name: "Privacy Policy", href: "/policies/privacy" },
    { name: "FAQ", href: "/faq" },
  ];

  const categories = [
    { name: "Dog Food", href: "/products/dog-food" },
    { name: "Cat Food", href: "/products/cat-food" },
    { name: "Pet Treats", href: "/products/treats" },
    { name: "Pet Toys", href: "/products/toys" },
    { name: "Pet Accessories", href: "/products/accessories" },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="Pet Palace"
              width={150}
              height={50}
              className="h-8 sm:h-10 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for all pet care needs. Quality products,
              expert advice, and loving care for your royal pets.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-orange-500">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-orange-500">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-orange-500">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  info@petpalace.com
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Pet Street, Animal City, PC 12345
                </span>
              </div>
            </div>

            {/* Customer Care Links - Mobile */}
            <div className="mt-6 sm:hidden">
              <h4 className="font-semibold mb-3 text-orange-500">
                Customer Care
              </h4>
              <ul className="space-y-2">
                {customerCare.slice(0, 3).map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Care - Desktop Only */}
        <div className="hidden sm:block mt-8 pt-8 border-t border-gray-800">
          <h3 className="font-semibold mb-4 text-orange-500">Customer Care</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {customerCare.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 space-y-2 sm:space-y-0">
            <p>&copy; 2024 Pet Palace. All rights reserved.</p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 text-xs sm:text-sm">
              <span>Secure Payment</span>
              <span>•</span>
              <span>Fast Delivery</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
