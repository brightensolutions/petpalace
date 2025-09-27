// app/terms-and-conditions/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="mb-6 inline-block bg-orange-100 text-orange-800 px-4 py-2 text-sm font-semibold rounded-lg">
              Terms & Conditions
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-orange-600">Terms</span> of Service
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Please read these terms carefully before using our website,
              products, and services. By accessing PetPalace, you agree to
              comply with these conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                title: "Acceptance of Terms",
                content:
                  "By accessing or using PetPalace, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions and our Privacy Policy.",
              },
              {
                title: "Eligibility",
                content:
                  "You must be at least 18 years old to use our services. If you are under 18, you may only use our website under the supervision of a parent or guardian.",
              },
              {
                title: "Account Responsibility",
                content:
                  "You are responsible for maintaining the confidentiality of your account details, including your password, and for all activities under your account.",
              },
              {
                title: "Orders & Payments",
                content:
                  "All orders are subject to availability and acceptance. Prices are displayed in INR and may change without notice. Payments must be completed at the time of order.",
              },
              {
                title: "Shipping & Delivery",
                content:
                  "We strive to deliver your orders within the estimated timelines. However, delays may occur due to unforeseen circumstances, and we are not liable for such delays.",
              },
              {
                title: "Returns & Refunds",
                content:
                  "Our Cancellation & Refund Policy applies to all returns. Certain products such as pet food and treats cannot be returned once opened due to hygiene reasons.",
              },
              {
                title: "Intellectual Property",
                content:
                  "All content, including text, images, logos, and product descriptions, are the intellectual property of PetPalace and cannot be reproduced without prior permission.",
              },
              {
                title: "Limitation of Liability",
                content:
                  "PetPalace will not be liable for any indirect, incidental, or consequential damages arising from the use of our services or products.",
              },
              {
                title: "Changes to Terms",
                content:
                  "We reserve the right to update or modify these Terms & Conditions at any time. Continued use of the website after changes means you accept the updated terms.",
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
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
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
