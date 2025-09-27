// app/cancellation-refund-policy/page.tsx
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function CancellationRefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="mb-6 inline-block bg-orange-100 text-orange-800 px-4 py-2 text-sm font-semibold rounded-lg">
              Cancellation & Refund Policy
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hassle-Free <span className="text-orange-600">Cancellations</span>{" "}
              & <span className="text-blue-600">Refunds</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              At PetPalace, we value your satisfaction. This policy explains how
              cancellations and refunds are handled for orders placed through
              our platform.
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
                title: "Order Cancellations",
                content: (
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      Orders can be cancelled within{" "}
                      <strong>24 hours of placing</strong> the order or before
                      dispatch, whichever is earlier.
                    </li>
                    <li>
                      Once an order has been processed or shipped, it cannot be
                      cancelled.
                    </li>
                    <li>
                      To request cancellation, please contact our support team
                      with your order ID.
                    </li>
                  </ul>
                ),
              },
              {
                title: "Refunds",
                content: (
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                      Refunds are issued only in cases of{" "}
                      <strong>order cancellation</strong>, defective products,
                      or incorrect items delivered.
                    </li>
                    <li>
                      Refunds will be processed to the original payment method
                      within <strong>7–10 business days</strong> after approval.
                    </li>
                    <li>
                      Shipping charges are non-refundable unless the issue was
                      caused by PetPalace.
                    </li>
                  </ul>
                ),
              },
              {
                title: "Exchanges",
                content: (
                  <p className="text-gray-600 leading-relaxed">
                    We currently do not offer direct product exchanges.
                    Customers are advised to return the item (if eligible) and
                    place a new order.
                  </p>
                ),
              },
              {
                title: "Contact Us",
                content: (
                  <p className="text-gray-600 leading-relaxed">
                    For any questions regarding cancellations or refunds, please
                    reach out to us at{" "}
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
