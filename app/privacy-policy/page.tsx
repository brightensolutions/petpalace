// app/privacy-policy/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="mb-6 inline-block bg-orange-100 text-orange-800 px-4 py-2 text-sm font-semibold rounded-lg">
              Privacy Policy
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your <span className="text-orange-600">Privacy</span> Matters to
              Us
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We value your trust. This Privacy Policy explains how we collect,
              use, and protect your personal information at PetPalace.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                title: "Information We Collect",
                content:
                  "We may collect personal details such as your name, email, phone number, shipping address, and payment details when you place an order or sign up on our website.",
              },
              {
                title: "How We Use Your Information",
                content:
                  "We use your information to process orders, provide customer support, send updates about your orders, personalize your shopping experience, and improve our services.",
              },
              {
                title: "Sharing of Information",
                content:
                  "We do not sell or trade your personal information. We may share data only with trusted service providers for order fulfillment, payment processing, and delivery purposes.",
              },
              {
                title: "Cookies & Tracking",
                content:
                  "We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can manage cookies through your browser settings.",
              },
              {
                title: "Data Security",
                content:
                  "We implement strict security measures including encryption and secure servers to protect your personal information from unauthorized access or misuse.",
              },
              {
                title: "Your Rights",
                content:
                  "You have the right to access, update, or delete your personal data. You can also opt out of receiving promotional communications anytime.",
              },
              {
                title: "Policy Updates",
                content:
                  "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.",
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
