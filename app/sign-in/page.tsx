"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SignInPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode] = useState("+91");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [notifyUpdates, setNotifyUpdates] = useState(false);

  const handleRequestOtp = () => {
    if (phoneNumber.length === 10) {
      setIsOtpSent(true);
    } else {
      alert("Please enter a valid 10-digit phone number.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 6) return;
    setIsVerifying(true);
    const fullNumber = `${countryCode}${phoneNumber}`;

    if (otp !== "123456") {
      alert("❌ Invalid OTP. Please try again.");
      setIsVerifying(false);
      return;
    }

    try {
      const checkRes = await fetch("/api/users/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: fullNumber }),
      });
      const checkData = await checkRes.json();

      if (!checkData.exists) {
        const createRes = await fetch("/api/users/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number: fullNumber }),
        });
        const createData = await createRes.json();

        if (!createData.success) {
          alert("Something went wrong while saving user.");
          return;
        }
      }

      setShowEmailInput(true);
    } catch (err) {
      console.error("OTP Verify Error:", err);
      alert("Something went wrong.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmitEmail = async () => {
    const fullNumber = `${countryCode}${phoneNumber}`;

    if (!email.includes("@")) {
      alert("Enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: fullNumber, email }),
      });
      const data = await res.json();

      if (data.success) {
        await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number: fullNumber, email }),
        });
        router.push("/");
      } else {
        alert("❌ Failed to update email.");
      }
    } catch (err) {
      console.error("❌ Email update error:", err);
      alert("Server error while saving email.");
    }
  };

  const handleSkipEmail = async () => {
    const fullNumber = `${countryCode}${phoneNumber}`;

    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: fullNumber }),
    });
    router.push("/");
  };

  const benefits = [
    {
      icon: Star,
      title: "Exclusive Deals",
      subtitle: "and Discounts",
      description: "Unlock savings with our exclusive deals and discounts.",
    },
    {
      icon: Zap,
      title: "Swift Checkout",
      subtitle: "Experience",
      description:
        "Effortless checkout awaits: swift, seamless, and stress-free!",
    },
    {
      icon: Shield,
      title: "Easy Order",
      subtitle: "Tracking",
      description: "Track your order history with ease, every step of the way!",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex items-center justify-center px-4 py-8 lg:py-16">
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Panel - Benefits */}
              <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12 text-white">
                <div className="flex flex-col justify-center h-full">
                  <div className="mb-8">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                      Welcome to
                      <br />
                      <span className="text-orange-400">PET PALACE!</span>
                    </h2>
                    <p className="text-blue-100 text-lg">
                      Register to avail the best deals!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
                      >
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <benefit.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">
                            {benefit.title}
                          </h3>
                          <h4 className="font-semibold text-sm text-orange-300 mb-2">
                            {benefit.subtitle}
                          </h4>
                          <p className="text-blue-100 text-xs">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Form */}
              <div className="lg:w-1/2 bg-white p-8 lg:p-12">
                <div className="flex flex-col justify-center h-full">
                  <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {showEmailInput
                        ? "Complete Profile"
                        : isOtpSent
                        ? "Verify OTP"
                        : "Login / Signup"}
                    </h1>
                    <p className="text-gray-600">
                      {showEmailInput
                        ? "Enter your email address (optional)"
                        : isOtpSent
                        ? "Enter the OTP sent to your phone"
                        : "Enter Mobile Number"}
                    </p>
                  </div>

                  {/* Phone Input */}
                  {!isOtpSent && !showEmailInput && (
                    <div className="space-y-6">
                      <div className="flex gap-2">
                        <div className="relative">
                          <button className="w-20 h-12 border-2 rounded-lg flex items-center justify-center gap-1 border-gray-200 bg-gray-50">
                            <span className="text-sm">🇮🇳</span>
                            <span className="text-sm font-medium">
                              {countryCode}
                            </span>
                          </button>
                        </div>
                        <Input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Enter Mobile Number"
                          maxLength={10}
                          className="flex-1 h-12 text-base border-2 focus:border-orange-500"
                        />
                      </div>

                      <Button
                        onClick={handleRequestOtp}
                        disabled={phoneNumber.length !== 10}
                        className="w-full h-12 bg-gray-800 text-white hover:bg-gray-900 disabled:bg-gray-300 text-base font-medium"
                      >
                        Submit
                      </Button>
                    </div>
                  )}

                  {/* OTP Input */}
                  {isOtpSent && !showEmailInput && (
                    <div className="space-y-6">
                      <Input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="text-center tracking-widest h-12 text-base border-2 focus:border-orange-500"
                      />

                      <Button
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6 || isVerifying}
                        className="w-full h-12 bg-gray-800 text-white hover:bg-gray-900 disabled:bg-gray-300 text-base font-medium"
                      >
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                      </Button>

                      <div className="text-center">
                        <button
                          onClick={() => setIsOtpSent(false)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Change phone number?
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  {showEmailInput && (
                    <div className="space-y-6">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-12 text-base border-2 focus:border-orange-500"
                      />

                      <div className="space-y-3">
                        <Button
                          onClick={handleSubmitEmail}
                          className="w-full h-12 bg-orange-500 text-white hover:bg-orange-600 text-base font-medium"
                        >
                          Save & Continue
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleSkipEmail}
                          className="w-full h-12 border-2 text-base font-medium bg-transparent"
                        >
                          Skip for now
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Footer Links */}
                  <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                      I accept that I have read & understood{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy and T&Cs
                      </Link>
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/trouble"
                        className="text-blue-600 hover:underline"
                      >
                        Trouble logging in?
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
