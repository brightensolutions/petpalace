import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, User, MessageSquare, Heart, HelpCircle } from "lucide-react"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our pet experts",
      contact: "1800-123-4567",
      subtext: "Toll-free • 24/7 Support",
      color: "blue",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Get detailed assistance",
      contact: "support@petpalace.com",
      subtext: "Response within 2 hours",
      color: "orange",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant help available",
      contact: "Chat Now",
      subtext: "Available 9 AM - 9 PM",
      color: "blue",
    },
  ]

  const officeInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: ["123 Pet Street", "Surat, Gujarat 395001", "India"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9 AM - 9 PM", "Saturday: 10 AM - 8 PM", "Sunday: 10 AM - 6 PM"],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Light Background with Black Font */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-blue-200 bg-opacity-60 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-blue-700" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black">Contact Us</h1>
          </div>
          <p className="text-lg text-black max-w-2xl mx-auto">
            We're here to help you and your pets. Reach out anytime for expert advice and support.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Get in Touch</h2>
            <p className="text-xl text-gray-600">Choose the way that works best for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white group cursor-pointer"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                        method.color === "orange" ? "bg-orange-100" : "bg-blue-100"
                      }`}
                    >
                      <method.icon
                        className={`w-8 h-8 ${method.color === "orange" ? "text-orange-600" : "text-blue-600"}`}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{method.title}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <p
                    className={`font-semibold text-lg mb-2 ${
                      method.color === "orange" ? "text-orange-600" : "text-blue-600"
                    }`}
                  >
                    {method.contact}
                  </p>
                  <p className="text-sm text-gray-500">{method.subtext}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Send us a Message</h2>
              </div>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          First Name
                        </label>
                        <Input
                          placeholder="Your first name"
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Last Name
                        </label>
                        <Input
                          placeholder="Your last name"
                          className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Subject
                      </label>
                      <Input
                        placeholder="How can we help you?"
                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </label>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Office Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Visit Our Office</h2>
              <div className="space-y-8">
                {officeInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            index === 0 ? "bg-orange-100" : "bg-blue-100"
                          }`}
                        >
                          <info.icon className={`w-6 h-6 ${index === 0 ? "text-orange-600" : "text-blue-600"}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-3 text-gray-900">{info.title}</h3>
                          <div className="space-y-1">
                            {info.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-gray-600">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Map Placeholder */}
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Interactive Map</p>
                      <p className="text-sm text-gray-500">Find us on Google Maps</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "What are your delivery timings?",
                answer:
                  "We deliver Monday to Saturday, 9 AM to 9 PM. Same-day delivery available for orders placed before 2 PM.",
              },
              {
                question: "Do you offer veterinary consultations?",
                answer:
                  "Yes! We have certified veterinarians available for online consultations. Book through our website or call us.",
              },
              {
                question: "What's your return policy?",
                answer:
                  "We offer a 30-day return policy on all products. Items must be in original condition with packaging.",
              },
              {
                question: "Do you have a loyalty program?",
                answer:
                  "Yes! Join our Pet Palace Rewards program to earn points on every purchase and get exclusive discounts.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 ml-11">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">Still Have Questions?</h2>
          </div>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Our pet experts are always ready to help you make the best choices for your furry friends
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call Now: 1800-123-4567
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Start Live Chat
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
