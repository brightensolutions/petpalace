"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {
              "We're here to help you and your royal pets. Get in touch with us!"
            }
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-blue-100">
              <h2 className="text-3xl font-bold mb-8 text-blue-800">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-700">
                      Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-blue-700">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-700">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-700">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-700">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 transition-colors"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-8 text-blue-800">
                  Get in Touch
                </h2>
                <p className="text-gray-600 mb-8">
                  Have questions about our products or need pet care advice? Our
                  team of experts is here to help you and your royal pets.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center text-blue-700">
                      <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                      Visit Our Store
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      123 Pet Street, Animal City
                      <br />
                      Pet Care District, PC 12345
                      <br />
                      India
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center text-blue-700">
                      <Phone className="w-5 h-5 mr-2 text-orange-500" />
                      Call Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      Customer Care:{" "}
                      <span className="text-blue-600 font-medium">
                        +91 12345 67890
                      </span>
                      <br />
                      Vet Consultation:{" "}
                      <span className="text-blue-600 font-medium">
                        +91 12345 67891
                      </span>
                      <br />
                      Emergency:{" "}
                      <span className="text-orange-600 font-medium">
                        +91 12345 67892
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center text-blue-700">
                      <Mail className="w-5 h-5 mr-2 text-orange-500" />
                      Email Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      General:{" "}
                      <span className="text-blue-600">info@petpalace.com</span>
                      <br />
                      Support:{" "}
                      <span className="text-blue-600">
                        support@petpalace.com
                      </span>
                      <br />
                      Vet Care:{" "}
                      <span className="text-blue-600">vet@petpalace.com</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center text-blue-700">
                      <Clock className="w-5 h-5 mr-2 text-orange-500" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      <span className="text-blue-600 font-medium">
                        Monday - Saturday:
                      </span>{" "}
                      9:00 AM - 8:00 PM
                      <br />
                      <span className="text-blue-600 font-medium">
                        Sunday:
                      </span>{" "}
                      10:00 AM - 6:00 PM
                      <br />
                      <span className="text-orange-600 font-medium">
                        Online Support:
                      </span>{" "}
                      24/7
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-blue-700 text-lg">
                  How fast is delivery?
                </h3>
                <p className="text-gray-600">
                  We offer{" "}
                  <span className="text-orange-600 font-medium">
                    same-day delivery
                  </span>{" "}
                  in select cities and
                  <span className="text-blue-600 font-medium">
                    {" "}
                    2-3 day delivery
                  </span>{" "}
                  nationwide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-blue-700 text-lg">
                  Do you offer vet consultations?
                </h3>
                <p className="text-gray-600">
                  Yes! We have{" "}
                  <span className="text-blue-600 font-medium">
                    certified veterinarians
                  </span>{" "}
                  available for
                  <span className="text-orange-600 font-medium">
                    {" "}
                    online consultations
                  </span>
                  .
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-blue-700 text-lg">
                  {"What's your return policy?"}
                </h3>
                <p className="text-gray-600">
                  We offer{" "}
                  <span className="text-blue-600 font-medium">
                    30-day returns
                  </span>{" "}
                  on unopened products and
                  <span className="text-orange-600 font-medium">
                    {" "}
                    7-day returns
                  </span>{" "}
                  on opened items.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-blue-700 text-lg">
                  Are your products authentic?
                </h3>
                <p className="text-gray-600">
                  <span className="text-orange-600 font-bold">100%!</span> We
                  source directly from
                  <span className="text-blue-600 font-medium">
                    {" "}
                    manufacturers and authorized distributors
                  </span>{" "}
                  only.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy pet parents who trust Pet Palace for their
            royal companions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 font-semibold">
              Shop Now
            </Button>
            <Button className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-3 font-semibold">
              Schedule Vet Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
