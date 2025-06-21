import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Users,
  Award,
  Shield,
  Truck,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { number: "5M+", label: "Happy Pets", icon: Heart },
    { number: "50K+", label: "Pet Parents", icon: Users },
    { number: "1000+", label: "Products", icon: Award },
    { number: "99%", label: "Satisfaction", icon: Star },
  ];

  const values = [
    {
      icon: Heart,
      title: "Pet-First Approach",
      description:
        "Every decision we make is centered around what&apos;s best for your beloved pets.",
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "We source only the highest quality products from trusted brands and manufacturers.",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "Building a supportive community of pet lovers who share knowledge and experiences.",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: Award,
      title: "Expert Guidance",
      description:
        "Our team of pet experts provides guidance to help you make the best choices.",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300&text=Priya+Sharma",
      bio: "Passionate pet lover with 10+ years in the pet industry.",
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Operations",
      image: "/placeholder.svg?height=300&width=300&text=Rajesh+Kumar",
      bio: "Ensures smooth operations and timely delivery of products.",
    },
    {
      name: "Dr. Anita Patel",
      role: "Veterinary Advisor",
      image: "/placeholder.svg?height=300&width=300&text=Dr.+Anita+Patel",
      bio: "Licensed veterinarian providing expert product recommendations.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "PetPalace Founded",
      description:
        "Started with a vision to provide quality pet products online.",
    },
    {
      year: "2021",
      title: "1000+ Products",
      description:
        "Expanded our catalog to include premium brands and essentials.",
    },
    {
      year: "2022",
      title: "50K+ Customers",
      description: "Reached a milestone of serving 50,000+ happy pet parents.",
    },
    {
      year: "2023",
      title: "Pan-India Delivery",
      description: "Extended our delivery network to cover all major cities.",
    },
    {
      year: "2024",
      title: "5M+ Happy Pets",
      description: "Celebrating 5 million pets served with love and care.",
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
              About PetPalace
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We&apos;re passionate about{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">
                your pets&apos; happiness
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              PetPalace was born from a simple belief: every pet deserves the
              best. We&apos;re here to make premium pet care accessible,
              affordable, and convenient for pet parents across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200"
              >
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    PetPalace began in 2020 when our founder, Priya, struggled
                    to find quality pet products for her rescue dog, Max.
                    Frustrated by limited options and high prices in local
                    stores, she envisioned a platform that would make premium
                    pet care accessible to every pet parent.
                  </p>
                  <p>
                    What started as a small online store has grown into
                    India&apos;s trusted pet care destination. We&apos;ve
                    carefully curated products from the world&apos;s best
                    brands, ensuring that every item meets our strict quality
                    standards.
                  </p>
                  <p>
                    Today, we&apos;re proud to serve over 50,000 pet parents and
                    their 5 million+ furry, feathered, and scaled family
                    members. Our mission remains the same: to provide
                    exceptional products and service that help pets live their
                    happiest, healthiest lives.
                  </p>
                </div>
                <div className="mt-8">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                    Learn More About Our Mission
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-100 to-blue-100 rounded-3xl p-8">
                  <Image
                    src="/placeholder.svg?height=400&width=500&text=Happy+Pets+Collage"
                    alt="Happy pets using PetPalace products"
                    width={500}
                    height={400}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        5M+ Happy Pets
                      </div>
                      <div className="text-sm text-gray-600">
                        Served with love
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <value.icon className={`w-8 h-8 ${value.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600">
                The passionate people behind PetPalace
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="w-32 h-32 rounded-full mx-auto object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-orange-600 font-semibold mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600">
                Key milestones in our growth story
              </p>
            </div>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-blue-500"></div>

              {/* Timeline Items */}
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {milestone.year}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Pet Parents Trust Us
              </h2>
              <p className="text-xl text-gray-600">
                We&apos;re committed to excellence in every aspect
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Truck,
                  title: "Fast & Free Delivery",
                  description:
                    "Free delivery on orders above ₹499. Same-day delivery available in select cities.",
                  color: "text-blue-600",
                  bgColor: "bg-blue-100",
                },
                {
                  icon: Shield,
                  title: "100% Authentic Products",
                  description:
                    "We source directly from authorized distributors and manufacturers.",
                  color: "text-green-600",
                  bgColor: "bg-green-100",
                },
                {
                  icon: Clock,
                  title: "24/7 Customer Support",
                  description:
                    "Our pet care experts are always available to help you and your pets.",
                  color: "text-orange-600",
                  bgColor: "bg-orange-100",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to give your pets the best care they deserve?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of happy pet parents who trust PetPalace for their
              pets&apos; needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
