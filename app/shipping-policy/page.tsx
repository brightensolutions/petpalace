// app/shipping-policy/page.tsx
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="mb-6 inline-block bg-orange-100 text-orange-800 px-4 py-2 text-sm font-semibold rounded-lg">
              Shipping Policy
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fast & Reliable <span className="text-blue-600">Delivery</span>{" "}
              for Your Pets
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              At PetPalace, we ensure your pet’s essentials are delivered safely
              and on time. This Shipping Policy outlines our delivery process,
              timelines, and charges.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                title: "Delivery Timelines",
                content: (
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      Orders are usually dispatched within{" "}
                      <strong>24–48 hours</strong> of confirmation.
                    </li>
                    <li>
                      Standard delivery time is{" "}
                      <strong>3–7 business days</strong>, depending on your
                      location.
                    </li>
                    <li>
                      Same-day delivery is available in select cities for orders
                      placed before <strong>2 PM</strong>.
                    </li>
                  </ul>
                ),
              },
              {
                title: "Shipping Charges",
                content: (
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      Free shipping on all orders above <strong>₹499</strong>.
                    </li>
                    <li>
                      A flat shipping fee of <strong>₹99</strong> applies to
                      orders below ₹499.
                    </li>
                    <li>
                      Additional delivery charges may apply for remote or
                      out-of-service locations.
                    </li>
                  </ul>
                ),
              },
              {
                title: "Order Tracking",
                content: (
                  <p className="text-gray-600 leading-relaxed">
                    Once your order is shipped, you will receive an email and
                    SMS with the tracking details. You can also track your order
                    directly from your{" "}
                    <span className="font-semibold">PetPalace account</span>.
                  </p>
                ),
              },
              {
                title: "International Shipping",
                content: (
                  <p className="text-gray-600 leading-relaxed">
                    Currently, we only ship within India. International shipping
                    is not available at the moment.
                  </p>
                ),
              },
              {
                title: "Delivery Delays",
                content: (
                  <p className="text-gray-600 leading-relaxed">
                    While we strive to deliver on time, unforeseen factors like
                    weather, courier delays, or holidays may affect timelines.
                    We will keep you informed in such cases.
                  </p>
                ),
              },
              {
                title: "Contact Us",
                content: (
                  <p className="text-gray-600 leading-relaxed">
                    For any shipping-related queries, please contact us at{" "}
                    <a
                      href="mailto:support@petpalace.com"
                      className="text-orange-600 hover:underline"
                    >
                      support@petpalace.com
                    </a>
                    .
                  </p>
                ),
              },
            ].map((section, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <div>{section.content}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
