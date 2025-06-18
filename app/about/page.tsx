import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Award,
  Users,
  Truck,
  Shield,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Pet Love",
      description:
        "We understand the unconditional love between pets and their families",
      color: "text-primary-orange-500",
    },
    {
      icon: Award,
      title: "Quality First",
      description: "Only the finest products make it to our royal collection",
      color: "text-primary-blue-600",
    },
    {
      icon: Users,
      title: "Expert Care",
      description: "Our team of pet experts is here to guide you every step",
      color: "text-primary-orange-500",
    },
    {
      icon: Truck,
      title: "Reliable Service",
      description: "Fast, secure delivery to keep your pets happy and healthy",
      color: "text-primary-blue-600",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Authentic Products",
      description: "Direct sourcing from manufacturers",
    },
    {
      icon: Clock,
      title: "24/7 Customer Support",
      description: "Always here when you need us",
    },
    {
      icon: Star,
      title: "Expert Veterinary Advice",
      description: "Professional guidance for your pets",
    },
    {
      icon: CheckCircle,
      title: "Satisfaction Guaranteed",
      description: "30-day return policy on all items",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Veterinarian",
      image: "/placeholder.svg?height=300&width=300",
      description: "15+ years of veterinary experience",
    },
    {
      name: "Mike Chen",
      role: "Pet Nutrition Expert",
      image: "/placeholder.svg?height=300&width=300",
      description: "Certified animal nutritionist",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Care Manager",
      image: "/placeholder.svg?height=300&width=300",
      description: "Dedicated to exceptional service",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-blue-500 to-primary-blue-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Pet Palace
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            The Kingdom of Royal Pets - Where every pet is treated like royalty
            and every family finds everything they need for their beloved
            companions
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-primary-blue-800">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Pet Palace was born from a simple belief:{" "}
                  <span className="text-primary-orange-600 font-semibold">
                    every pet deserves royal treatment
                  </span>
                  . Founded in 2020, we started as a small family business with
                  a big dream - to create a kingdom where pets and their
                  families could find everything they need for a happy, healthy
                  life together.
                </p>
                <p>
                  What began as a local pet store has grown into a{" "}
                  <span className="text-primary-blue-600 font-semibold">
                    trusted online destination
                  </span>{" "}
                  for pet parents across the country. We&apos;ve carefully
                  curated a collection of premium products, from nutritious food
                  to fun toys, all designed to keep your royal companions happy
                  and healthy.
                </p>
                <p>
                  Today, Pet Palace serves{" "}
                  <span className="text-primary-orange-600 font-semibold">
                    thousands of happy pet families
                  </span>
                  , but our mission remains the same: to provide exceptional
                  products and service that honor the special bond between pets
                  and their humans.
                </p>
              </div>
              <div className="mt-8">
                <Button className="bg-primary-blue-600 hover:bg-primary-blue-700 text-white px-8 py-3">
                  Shop Our Collection
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-blue-100 to-primary-orange-100 rounded-2xl p-8">
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Pet Palace Story - Happy pets and families"
                  width={600}
                  height={500}
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-primary-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary-blue-800">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at Pet Palace
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 border-primary-blue-100 bg-white group"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <value.icon
                      className={`w-16 h-16 ${value.color} mx-auto group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-primary-blue-800">
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
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-primary-blue-800 to-primary-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-2xl text-primary-blue-100 leading-relaxed mb-8">
              To create a world where every pet lives like royalty - healthy,
              happy, and loved.
            </p>
            <p className="text-lg text-primary-blue-200 leading-relaxed">
              We&apos;re committed to providing premium products, expert
              guidance, and exceptional service that strengthens the bond
              between pets and their families. Every decision we make is guided
              by one simple question: Is this good enough for our own beloved
              pets?
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary-blue-800">
              Why Choose Pet Palace?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re more than just a pet store - we&apos;re your partners
              in pet care
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-primary-blue-100 to-primary-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-10 h-10 text-primary-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary-blue-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-primary-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary-blue-800">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate professionals dedicated to your pet&apos;s wellbeing
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 border-primary-blue-100 bg-white overflow-hidden group"
              >
                <div className="relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-blue-900/20 to-transparent"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-primary-blue-800">
                    {member.name}
                  </h3>
                  <p className="text-primary-orange-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-primary-blue-800">
              Pet Palace by the Numbers
            </h2>
            <p className="text-xl text-gray-600">
              Our growing community of happy pets and families
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="bg-gradient-to-br from-primary-orange-100 to-primary-orange-200 rounded-2xl p-8 group-hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl font-bold text-primary-orange-600 mb-2">
                  50K+
                </div>
                <div className="text-gray-600 font-medium">Happy Pets</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 rounded-2xl p-8 group-hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl font-bold text-primary-blue-600 mb-2">
                  1000+
                </div>
                <div className="text-gray-600 font-medium">
                  Premium Products
                </div>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-primary-orange-100 to-primary-orange-200 rounded-2xl p-8 group-hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl font-bold text-primary-orange-600 mb-2">
                  25K+
                </div>
                <div className="text-gray-600 font-medium">Pet Families</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 rounded-2xl p-8 group-hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl font-bold text-primary-blue-600 mb-2">
                  4.8★
                </div>
                <div className="text-gray-600 font-medium">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary-blue-600 to-primary-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the Pet Palace Family?
          </h2>
          <p className="text-xl text-primary-blue-100 mb-10 max-w-3xl mx-auto">
            Discover why thousands of pet parents trust us with their royal
            companions. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-white text-primary-blue-700 hover:bg-primary-blue-50 px-10 py-4 text-lg font-semibold">
              Explore Products
            </Button>
            <Button className="bg-primary-orange-500 text-white hover:bg-primary-orange-600 px-10 py-4 text-lg font-semibold">
              Contact Our Experts
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
