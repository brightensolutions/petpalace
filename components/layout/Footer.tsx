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
    <footer className="bg-white text-gray-700">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and About */}
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="Pet Palace"
              width={150}
              height={50}
              className="h-auto w-auto"
            />
            <p className="text-sm leading-relaxed">
              Your trusted partner for all pet care needs. Quality products,
              expert advice, and loving care for your royal pets.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <Link
                  href="#"
                  key={index}
                  className="text-primary-blue-700 hover:text-primary-orange-500 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-blue-700">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-orange-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-blue-700">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm hover:text-primary-orange-500 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-primary-blue-700">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-orange-500" />
                <span className="text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-orange-500" />
                <span className="text-sm">info@petpalace.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary-orange-500 mt-0.5" />
                <span className="text-sm">
                  123 Pet Street, Animal City, PC 12345
                </span>
              </div>
            </div>

            {/* Customer Care for mobile */}
            <div className="mt-6 sm:hidden">
              <h4 className="font-semibold mb-3 text-primary-blue-700">
                Customer Care
              </h4>
              <ul className="space-y-2">
                {customerCare.slice(0, 3).map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-primary-orange-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Care Desktop */}
        <div className="hidden sm:block mt-10 pt-8 border-t border-gray-200">
          <h3 className="font-semibold mb-4 text-primary-blue-700">
            Customer Care
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {customerCare.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm hover:text-primary-orange-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 text-sm flex flex-col sm:flex-row justify-between items-center text-gray-600">
          <p>&copy; 2024 Pet Palace. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 text-xs sm:text-sm mt-2 sm:mt-0">
            <span>Secure Payment</span>
            <span>•</span>
            <span>Fast Delivery</span>
            <span>•</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
