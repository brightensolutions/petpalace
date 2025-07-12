"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
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
        // ✅ Login to set cookie
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

    // ✅ Login even if email skipped
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: fullNumber }),
    });

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {showEmailInput
                  ? "Complete your profile"
                  : isOtpSent
                  ? "Verify OTP"
                  : "Login with OTP"}
              </h1>
              <p className="text-gray-600">
                {showEmailInput
                  ? "Enter your email address (optional)"
                  : isOtpSent
                  ? "Enter the OTP sent to your phone"
                  : "Enter your login details"}
              </p>
            </div>

            {/* Phone Input */}
            {!isOtpSent && !showEmailInput && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      className="w-24 h-12 border-2 rounded-lg flex items-center justify-center gap-1 border-gray-200"
                      disabled
                    >
                      <span className="text-sm">🇮🇳</span>
                      <span className="text-sm font-medium">{countryCode}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone number"
                    maxLength={10}
                    className="flex-1 h-12 text-base"
                  />
                </div>
                <Button
                  onClick={handleRequestOtp}
                  className="w-full h-12 bg-orange-500 text-white hover:bg-orange-600"
                >
                  Request OTP <ArrowRight className="ml-2 w-5 h-5" />
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
                  className="text-center tracking-widest"
                />
                <Button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6 || isVerifying}
                  className="w-full h-12 bg-orange-500 text-white hover:bg-orange-600"
                >
                  {isVerifying ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            )}

            {/* Email Input */}
            {showEmailInput && (
              <div className="space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleSubmitEmail}
                    className="flex-1 h-12 bg-orange-500 text-white hover:bg-orange-600"
                  >
                    Save & Continue
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkipEmail}
                    className="flex-1 h-12"
                  >
                    Skip for now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
