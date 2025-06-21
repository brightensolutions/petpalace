import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Heart,
  Award,
  Users,
  Shield,
  CheckCircle,
  Star,
  Truck,
  DollarSign,
  Package,
  Phone,
  Target,
  TrendingUp,
  Globe,
  Camera,
  PawPrint,
} from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Pet Love",
      description: "We understand the bond between pets and families",
    },
    {
      icon: Award,
      title: "Quality First",
      description: "Only premium products for your beloved companions",
    },
    {
      icon: Users,
      title: "Expert Care",
      description: "Professional guidance from pet care specialists",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "100% authentic products with guaranteed quality",
    },
  ]

  const timeline = [
    {
      year: "2020",
      icon: Target,
      title: "The Beginning",
      description: "Started as a small family business with a dream to provide royal treatment for every pet.",
    },
    {
      year: "2021",
      icon: TrendingUp,
      title: "First Milestone",
      description: "Reached 1,000 happy customers and expanded our product range to include premium pet food.",
    },
    {
      year: "2022",
      icon: Globe,
      title: "Going Digital",
      description: "Launched our online platform and introduced home delivery services across major cities.",
    },
    {
      year: "2023",
      icon: Users,
      title: "Expert Team",
      description: "Added veterinary consultations and pet care experts to our growing team.",
    },
    {
      year: "2024",
      icon: Star,
      title: "Royal Success",
      description: "Now serving 50,000+ pets with 25,000+ families trusting us as their pet care partner.",
    },
  ]

  const whyChooseUs = [
    {
      icon: CheckCircle,
      title: "Premium Quality Products",
      description: "We source only the finest products from trusted manufacturers worldwide.",
    },
    {
      icon: Users,
      title: "Expert Veterinary Support",
      description: "24/7 access to certified veterinarians for health consultations and advice.",
    },
    {
      icon: Truck,
      title: "Fast & Reliable Delivery",
      description: "Same-day delivery available with secure packaging to keep products fresh.",
    },
    {
      icon: Heart,
      title: "Customer-First Approach",
      description: "Your satisfaction is our priority with hassle-free returns and dedicated support.",
    },
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Best prices guaranteed with regular discounts and loyalty rewards.",
    },
    {
      icon: Package,
      title: "Wide Product Range",
      description: "Everything your pet needs from food to toys, all available in one place.",
    },
  ]

  const stats = [
    { number: "50K+", label: "Happy Pets" },
    { number: "25K+", label: "Pet Families" },
    { number: "1000+", label: "Products" },
    { number: "4.8★", label: "Rating" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Light Background with Black Font */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">About Us</h1>
          <p className="text-lg text-black max-w-3xl mx-auto">
            Where every pet is treated like royalty and every family finds everything they need for their beloved
            companions
          </p>
        </div>
      </section>

      {/* Story Section - Content Left, Image Right */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-gray-900">Our Story</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Pet Palace was born from a simple belief:{" "}
                  <span className="text-orange-600 font-semibold">every pet deserves royal treatment</span>. Founded in
                  2020, we started as a small family business with a big dream to revolutionize pet care.
                </p>
                <p>
                  What began as a local pet store has grown into a{" "}
                  <span className="text-blue-600 font-semibold">trusted online destination</span> for pet parents across
                  the country. We carefully curate premium products for happy, healthy pets.
                </p>
                <p>
                  Today, we serve <span className="text-orange-600 font-semibold">thousands of happy pet families</span>
                  , but our mission remains the same: exceptional products and service that honor the special bond
                  between pets and their humans.
                </p>
              </div>
              <div className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8">
                <Image
                  src="/placeholder.svg?height=400&width=500&text=Happy+pets+and+families"
                  alt="Happy pets and families"
                  width={500}
                  height={400}
                  className="rounded-2xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Image Left, Content Right */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-3xl p-8">
                <Image
                  src="/placeholder.svg?height=400&width=500&text=Our+Mission+Visual"
                  alt="Our mission visual"
                  width={500}
                  height={400}
                  className="rounded-2xl w-full"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-2xl text-gray-700 mb-8 font-semibold">
                To create a world where every pet lives like royalty - healthy, happy, and loved.
              </p>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  We're committed to providing premium products, expert guidance, and exceptional service that
                  strengthens the bond between pets and their families.
                </p>
                <p>
                  Every decision we make is guided by one simple question: Is this good enough for our own beloved pets?
                  This philosophy drives us to maintain the highest standards in everything we do.
                </p>
              </div>
              <div className="mt-8">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Join Our Mission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Love for Pets Section - Light Orange to Blue Gradient with Visible Pet Graphics */}
      <section className="py-20 bg-gradient-to-br from-orange-100 to-blue-100 relative overflow-hidden">
        {/* Pet-themed Background Graphics - More Visible */}
        <div className="absolute inset-0 opacity-25">
          {/* Hearts */}
          <Heart className="absolute top-20 left-10 w-16 h-16 text-blue-600 animate-pulse" />
          <Heart className="absolute top-40 right-20 w-12 h-12 text-orange-600 animate-pulse delay-1000" />
          <Heart className="absolute bottom-32 left-32 w-20 h-20 text-blue-600 animate-pulse delay-2000" />
          <Heart className="absolute bottom-20 right-16 w-14 h-14 text-orange-600 animate-pulse delay-500" />

          {/* Paw Prints */}
          <PawPrint className="absolute top-32 left-1/4 w-10 h-10 text-blue-600 animate-pulse delay-700" />
          <PawPrint className="absolute top-60 right-1/3 w-8 h-8 text-orange-600 animate-pulse delay-1500" />
          <PawPrint className="absolute bottom-40 left-1/3 w-12 h-12 text-blue-600 animate-pulse delay-300" />
          <PawPrint className="absolute bottom-60 right-1/4 w-10 h-10 text-orange-600 animate-pulse delay-1200" />

          {/* Additional Hearts */}
          <Heart className="absolute top-16 left-1/2 w-8 h-8 text-blue-600 animate-pulse delay-800" />
          <Heart className="absolute top-72 left-16 w-10 h-10 text-orange-600 animate-pulse delay-400" />
          <Heart className="absolute bottom-16 left-1/2 w-12 h-12 text-blue-600 animate-pulse delay-1800" />

          {/* More Paw Prints */}
          <PawPrint className="absolute top-48 right-12 w-6 h-6 text-orange-600 animate-pulse delay-600" />
          <PawPrint className="absolute bottom-48 right-1/2 w-14 h-14 text-blue-600 animate-pulse delay-1100" />

          {/* Additional scattered elements for more visual interest */}
          <Heart className="absolute top-28 right-1/4 w-9 h-9 text-orange-500 animate-pulse delay-900" />
          <PawPrint className="absolute top-80 left-20 w-7 h-7 text-blue-500 animate-pulse delay-1300" />
          <Heart className="absolute bottom-28 right-32 w-11 h-11 text-blue-500 animate-pulse delay-1600" />
          <PawPrint className="absolute bottom-72 left-1/2 w-9 h-9 text-orange-500 animate-pulse delay-200" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <div className="mb-12">
              <div className="w-20 h-20 bg-white bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Love for Pets</h2>
              <p className="text-xl text-gray-800 max-w-2xl mx-auto">
                Beyond business, it's personal. We share an unbreakable bond with every furry, feathered, and scaled
                friend.
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8 text-gray-800 text-lg leading-relaxed mb-12">
              <p className="text-xl">
                Our passion runs deeper than business. It's about those precious moments when a dog's tail wags with
                pure joy, when a cat purrs contentedly, or when a bird chirps its morning song.
              </p>
              <p>
                Every team member at Pet Palace is a pet parent first. We understand the midnight vet visits, the joy of
                teaching new tricks, and the unconditional love that only pets can give.
              </p>
            </div>

            {/* Simple Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-2 shadow-lg">
                <Camera className="w-5 h-5" />
                See Our Story
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-2 shadow-lg">
                <Phone className="w-5 h-5" />
                Talk to Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline History Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a small family business to a trusted pet care destination
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-orange-500 hidden md:block"></div>

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-8">
                    {/* Timeline Dot with Icon */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                        index % 2 === 0 ? "bg-blue-500" : "bg-orange-500"
                      }`}
                    >
                      <item.icon className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <span
                              className={`text-2xl font-bold ${index % 2 === 0 ? "text-blue-600" : "text-orange-600"}`}
                            >
                              {item.year}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Why Choose Pet Palace?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're more than just a pet store - we're your partners in pet care
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {whyChooseUs.map((reason, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                        index % 2 === 0 ? "bg-orange-100" : "bg-blue-100"
                      }`}
                    >
                      <reason.icon className={`w-8 h-8 ${index % 2 === 0 ? "text-orange-600" : "text-blue-600"}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{reason.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Pet Palace
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-white group"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                        index % 2 === 0 ? "bg-orange-100" : "bg-blue-100"
                      }`}
                    >
                      <value.icon className={`w-8 h-8 ${index % 2 === 0 ? "text-orange-600" : "text-blue-600"}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Pet Palace by the Numbers</h2>
            <p className="text-xl text-gray-600">Our growing community of happy pets and families</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 ${index % 2 === 0 ? "bg-orange-50" : "bg-blue-50"}`}
                >
                  <div className={`text-4xl font-bold mb-2 ${index % 2 === 0 ? "text-orange-600" : "text-blue-600"}`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Content Left, Team Right */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Meet Our Expert Team</h2>
              </div>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Our team consists of <span className="text-blue-600 font-semibold">passionate pet lovers</span> and
                  industry experts who understand what it takes to keep your furry friends happy and healthy.
                </p>
                <p>
                  From certified veterinarians to nutrition specialists, every team member brings years of experience
                  and a genuine love for animals to ensure you get the{" "}
                  <span className="text-orange-600 font-semibold">best advice and service</span>.
                </p>
                <p>
                  We're not just employees - we're pet parents too, and we treat every customer's pet as if they were
                  our own family members.
                </p>
              </div>
              <div className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Our Experts
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Chief Veterinarian",
                  description: "15+ years of veterinary experience",
                  icon: Users,
                },
                {
                  name: "Mike Chen",
                  role: "Pet Nutrition Expert",
                  description: "Certified animal nutritionist",
                  icon: Award,
                },
                {
                  name: "Emily Rodriguez",
                  role: "Customer Care Manager",
                  description: "Dedicated to exceptional service",
                  icon: Heart,
                },
                {
                  name: "David Kumar",
                  role: "Product Specialist",
                  description: "Expert in pet product selection",
                  icon: Package,
                },
              ].map((member, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-white group"
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <member.icon className={`w-8 h-8 ${index % 2 === 0 ? "text-blue-600" : "text-orange-600"}`} />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-gray-900">{member.name}</h3>
                    <p className="text-orange-600 font-semibold mb-2 text-sm">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Family?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Discover why thousands of pet parents trust us with their royal companions
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-2">
              <Package className="w-5 h-5" />
              Shop Now
            </Button>
            <Button className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold rounded-xl flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
