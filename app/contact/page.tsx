import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "1800-123-4567",
      subtext: "Toll-free • Available 24/7",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@petpalace.com",
      subtext: "We&apos;ll respond within 2 hours",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: "123 Pet Street, Surat, Gujarat",
      subtext: "Open Mon-Sat, 9 AM - 8 PM",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const faqs = [
    {
      question: "What are your delivery charges?",
      answer:
        "We offer free delivery on orders above ₹499. For orders below ₹499, delivery charges are ₹99.",
    },
    {
      question: "Do you have a return policy?",
      answer:
        "Yes, we have a 7-day return policy for unopened products. Pet food and treats cannot be returned once opened for hygiene reasons.",
    },
    {
      question: "Are your products authentic?",
      answer:
        "We source all our products directly from authorized distributors and manufacturers to ensure 100% authenticity.",
    },
    {
      question: "Do you provide same-day delivery?",
      answer:
        "Yes, we offer same-day delivery in select cities including Mumbai, Delhi, Bangalore, and Pune for orders placed before 2 PM.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-orange-100 text-orange-800 px-4 py-2 text-sm font-semibold">
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We&apos;re here to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">
                help you and your pets
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Have questions about our products or need pet care advice? Our
              friendly team of pet experts is ready to assist you 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">
                Choose the way that works best for you
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${info.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <info.icon className={`w-8 h-8 ${info.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      {info.details}
                    </p>
                    <p className="text-sm text-gray-600">{info.subtext}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        className="h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        className="h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What can we help you with?"
                      className="h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[120px] rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
                    />
                  </div>

                  <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Business Hours
                </h3>
                <Card className="border-0 shadow-lg mb-8">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
                        { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
                        { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
                      ].map((schedule, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="font-semibold text-gray-700">
                            {schedule.day}
                          </span>
                          <span className="text-gray-600">
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          24/7 Online Support
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Our online chat support is available round the clock for
                        urgent queries.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Chat
                </h3>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        Need Immediate Help?
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Start a live chat with our pet care experts for instant
                        assistance.
                      </p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                        Start Live Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Quick answers to common questions
              </p>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Button
                variant="outline"
                className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 px-6 py-2 rounded-lg font-semibold"
              >
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
