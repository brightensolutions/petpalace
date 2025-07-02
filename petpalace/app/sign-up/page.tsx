"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MessageSquare,
  ChevronDown,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const countries = [
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+1", flag: "🇺🇸", name: "USA" },
    { code: "+44", flag: "🇬🇧", name: "UK" },
  ];

  const handleRequestOtp = () => {
    if (formData.phoneNumber.length >= 10 && formData.name && formData.email) {
      setIsOtpSent(true);
      console.log("Requesting OTP for:", countryCode + formData.phoneNumber);
    }
  };

  const handleVerifyOtp = () => {
    console.log("Verifying OTP:", otp, "for user:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Sign Up Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isOtpSent ? "Verify OTP" : "Create Account"}
              </h1>
              <p className="text-gray-600">
                {isOtpSent
                  ? "Enter the OTP sent to your phone"
                  : "Join the PetPalace family today"}
              </p>
            </div>

            {!isOtpSent ? (
              <div className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="pl-12 h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email"
                      className="pl-12 h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowCountryDropdown(!showCountryDropdown)
                        }
                        className="w-24 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center gap-1 hover:border-gray-300 transition-colors"
                      >
                        <span className="text-sm">
                          {countries.find((c) => c.code === countryCode)?.flag}
                        </span>
                        <span className="text-sm font-medium">
                          {countryCode}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          {countries.map((country) => (
                            <button
                              key={country.code}
                              onClick={() => {
                                setCountryCode(country.code);
                                setShowCountryDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                            >
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                              <span className="text-gray-500">
                                {country.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="Phone number"
                      className="flex-1 h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Create Account Button */}
                <Button
                  onClick={handleRequestOtp}
                  disabled={
                    formData.phoneNumber.length < 10 ||
                    !formData.name ||
                    !formData.email
                  }
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* reCAPTCHA Placeholder */}
                <div className="flex justify-center">
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5" />
                    <span className="text-sm text-gray-700">
                      I&apos;m not a robot
                    </span>

                    <div className="text-xs text-gray-500">reCAPTCHA</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Or Sign Up Using
                    </span>
                  </div>
                </div>

                {/* WhatsApp Sign Up */}
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-gray-700 font-medium"
                >
                  <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                  WhatsApp
                </Button>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By creating an account, I accept that I have read & understood{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    T&C
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* OTP Input */}
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full h-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 text-base text-center tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-sm text-gray-600 text-center">
                    OTP sent to {countryCode} {formData.phoneNumber}
                  </p>
                </div>

                {/* Verify OTP Button */}
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify & Create Account
                </Button>

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    onClick={() => setIsOtpSent(false)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Didn&apos;t receive OTP? Resend
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
