"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  MapPin,
  Clock,
  CreditCard,
  Smartphone,
  Wallet,
  Truck,
  Shield,
  Check,
  ChevronRight,
  Plus,
  Edit,
  Gift,
  Tag,
  Phone,
  Home,
  Building,
} from "lucide-react";
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  variant?: string;
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Mock cart items
  const cartItems: CartItem[] = [
    {
      id: "1",
      name: "Royal Canin Adult Dog Food - Chicken & Rice",
      price: 1299,
      originalPrice: 1499,
      image: "/placeholder.svg?height=80&width=80&text=Dog+Food",
      quantity: 2,
      category: "Dog Food",
      variant: "2kg Pack",
    },
    {
      id: "2",
      name: "Interactive Puzzle Toy for Dogs",
      price: 599,
      image: "/placeholder.svg?height=80&width=80&text=Dog+Toy",
      quantity: 1,
      category: "Dog Toys",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 99;
  const promoDiscount = isPromoApplied ? 150 : 0;
  const total = subtotal + deliveryFee - promoDiscount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save150") {
      setIsPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Address */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-orange-600" />
                        Contact Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Address */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        Delivery Address
                      </h2>

                      {/* Saved Addresses */}
                      <div className="space-y-4 mb-6">
                        <RadioGroup
                          value={selectedAddress}
                          onValueChange={setSelectedAddress}
                        >
                          <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                            <RadioGroupItem
                              value="home"
                              id="home"
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor="home"
                                className="flex items-center gap-2 font-medium cursor-pointer"
                              >
                                <Home className="w-4 h-4" />
                                Home
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                123 Pet Street, Koramangala, Bangalore - 560034
                              </p>
                              <p className="text-sm text-gray-500">
                                John Doe • +91 98765 43210
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                            <RadioGroupItem
                              value="office"
                              id="office"
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor="office"
                                className="flex items-center gap-2 font-medium cursor-pointer"
                              >
                                <Building className="w-4 h-4" />
                                Office
                              </Label>
                              <p className="text-sm text-gray-600 mt-1">
                                456 Tech Park, Electronic City, Bangalore -
                                560100
                              </p>
                              <p className="text-sm text-gray-500">
                                John Doe • +91 98765 43210
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </RadioGroup>

                        <Button
                          variant="outline"
                          className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Address
                        </Button>
                      </div>

                      {/* New Address Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            placeholder="Enter full name"
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            placeholder="House/Flat no, Building name, Street"
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="City"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            placeholder="560001"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="Karnataka"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="landmark">Landmark (Optional)</Label>
                          <Input
                            id="landmark"
                            placeholder="Near metro station"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Options */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-orange-600" />
                        Delivery Options
                      </h2>
                      <RadioGroup
                        value={selectedDelivery}
                        onValueChange={setSelectedDelivery}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                            <RadioGroupItem value="standard" id="standard" />
                            <div className="flex-1">
                              <Label
                                htmlFor="standard"
                                className="font-medium cursor-pointer"
                              >
                                Standard Delivery (FREE)
                              </Label>
                              <p className="text-sm text-gray-600">
                                2-3 business days
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              FREE
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                            <RadioGroupItem value="express" id="express" />
                            <div className="flex-1">
                              <Label
                                htmlFor="express"
                                className="font-medium cursor-pointer"
                              >
                                Express Delivery
                              </Label>
                              <p className="text-sm text-gray-600">
                                Next day delivery
                              </p>
                            </div>
                            <span className="font-semibold">₹99</span>
                          </div>

                          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                            <RadioGroupItem value="scheduled" id="scheduled" />
                            <div className="flex-1">
                              <Label
                                htmlFor="scheduled"
                                className="font-medium cursor-pointer"
                              >
                                Scheduled Delivery
                              </Label>
                              <p className="text-sm text-gray-600">
                                Choose your preferred time slot
                              </p>
                            </div>
                            <span className="font-semibold">₹49</span>
                          </div>
                        </div>
                      </RadioGroup>

                      {selectedDelivery === "scheduled" && (
                        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                          <Label className="font-medium mb-3 block">
                            Select Time Slot
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "9:00 AM - 12:00 PM",
                              "12:00 PM - 3:00 PM",
                              "3:00 PM - 6:00 PM",
                              "6:00 PM - 9:00 PM",
                            ].map((slot) => (
                              <Button
                                key={slot}
                                variant="outline"
                                size="sm"
                                className="text-sm bg-transparent"
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                {slot}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg rounded-xl"
                  >
                    Continue to Payment
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-orange-600" />
                        Payment Method
                      </h2>

                      <RadioGroup
                        value={selectedPayment}
                        onValueChange={setSelectedPayment}
                      >
                        <div className="space-y-4">
                          {/* Credit/Debit Card */}
                          <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                            <div className="flex items-center space-x-3 mb-4">
                              <RadioGroupItem value="card" id="card" />
                              <Label
                                htmlFor="card"
                                className="font-medium cursor-pointer flex items-center gap-2"
                              >
                                <CreditCard className="w-4 h-4" />
                                Credit/Debit Card
                              </Label>
                            </div>
                            {selectedPayment === "card" && (
                              <div className="space-y-4 pl-7">
                                <div>
                                  <Label htmlFor="cardNumber">
                                    Card Number
                                  </Label>
                                  <Input
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                      id="expiry"
                                      placeholder="MM/YY"
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                      id="cvv"
                                      placeholder="123"
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="cardName">Name on Card</Label>
                                  <Input
                                    id="cardName"
                                    placeholder="John Doe"
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* UPI */}
                          <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                            <div className="flex items-center space-x-3 mb-4">
                              <RadioGroupItem value="upi" id="upi" />
                              <Label
                                htmlFor="upi"
                                className="font-medium cursor-pointer flex items-center gap-2"
                              >
                                <Smartphone className="w-4 h-4" />
                                UPI
                              </Label>
                            </div>
                            {selectedPayment === "upi" && (
                              <div className="pl-7">
                                <Label htmlFor="upiId">UPI ID</Label>
                                <Input
                                  id="upiId"
                                  placeholder="yourname@paytm"
                                  className="mt-1"
                                />
                              </div>
                            )}
                          </div>

                          {/* Wallets */}
                          <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="wallet" id="wallet" />
                              <Label
                                htmlFor="wallet"
                                className="font-medium cursor-pointer flex items-center gap-2"
                              >
                                <Wallet className="w-4 h-4" />
                                Digital Wallets
                              </Label>
                            </div>
                            {selectedPayment === "wallet" && (
                              <div className="pl-7 mt-4 grid grid-cols-3 gap-2">
                                {["Paytm", "PhonePe", "Google Pay"].map(
                                  (wallet) => (
                                    <Button
                                      key={wallet}
                                      variant="outline"
                                      size="sm"
                                    >
                                      {wallet}
                                    </Button>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* Cash on Delivery */}
                          <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="cod" id="cod" />
                              <Label
                                htmlFor="cod"
                                className="font-medium cursor-pointer flex items-center gap-2"
                              >
                                <Truck className="w-4 h-4" />
                                Cash on Delivery
                              </Label>
                              <Badge className="bg-orange-100 text-orange-800">
                                ₹25 fee
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-12 rounded-xl font-semibold"
                    >
                      Back to Address
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl"
                    >
                      Review Order
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Order Review
                      </h2>

                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">{item.name}</h3>
                              {item.variant && (
                                <p className="text-sm text-gray-600">
                                  {item.variant}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ₹{item.price * item.quantity}
                              </p>
                              {item.originalPrice && (
                                <p className="text-sm text-gray-500 line-through">
                                  ₹{item.originalPrice * item.quantity}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address */}
                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-2">Delivery Address</h3>
                        <p className="text-gray-600">
                          123 Pet Street, Koramangala, Bangalore - 560034
                        </p>
                        <p className="text-gray-600">
                          John Doe • +91 98765 43210
                        </p>
                      </div>

                      {/* Payment Method */}
                      <div className="border-t pt-6">
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <p className="text-gray-600 capitalize">
                          {selectedPayment.replace("_", " ")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 h-12 rounded-xl font-semibold"
                    >
                      Back to Payment
                    </Button>
                    <Button className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl">
                      Place Order
                      <Check className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Order Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      Order Summary
                    </h2>

                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="rounded-lg"
                            />
                            <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                              {item.quantity}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                              {item.name}
                            </h3>
                            {item.variant && (
                              <p className="text-xs text-gray-600">
                                {item.variant}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              ₹{item.price * item.quantity}
                            </p>
                            {item.originalPrice && (
                              <p className="text-xs text-gray-500 line-through">
                                ₹{item.originalPrice * item.quantity}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code */}
                    <div className="mb-6">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={applyPromoCode}
                          variant="outline"
                          className="text-orange-600 border-orange-300 bg-transparent"
                        >
                          <Tag className="w-4 h-4" />
                        </Button>
                      </div>
                      {isPromoApplied && (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Promo code applied successfully!
                        </p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">₹{subtotal}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>You Save</span>
                          <span className="font-semibold">-₹{savings}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span
                          className={`font-semibold ${
                            deliveryFee === 0 ? "text-green-600" : ""
                          }`}
                        >
                          {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                        </span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Promo Discount</span>
                          <span className="font-semibold">
                            -₹{promoDiscount}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>₹{total}</span>
                        </div>
                      </div>
                    </div>

                    {subtotal < 499 && (
                      <div className="bg-orange-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-orange-600">
                          Add ₹{499 - subtotal} more for FREE delivery!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Trust Indicators */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        {
                          icon: Shield,
                          text: "Secure payments",
                          color: "text-green-600",
                        },
                        {
                          icon: Truck,
                          text: "Free delivery above ₹499",
                          color: "text-blue-600",
                        },
                        {
                          icon: Gift,
                          text: "Easy returns",
                          color: "text-purple-600",
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="text-sm text-gray-700">
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
