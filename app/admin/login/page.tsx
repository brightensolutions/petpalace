"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");
    if (token) {
      window.location.href = "/admin/dashboard";
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("adminToken", data.data.token);
        storage.setItem("adminEmail", data.data.admin.email);
        setMessage({
          type: "success",
          text: "Login successful! Redirecting to dashboard...",
        });
        window.location.href = "/admin/dashboard";
      } else {
        setMessage({
          type: "error",
          text: data.message || "Invalid credentials. Please try again.",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred during login. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative h-16 w-40">
              <Image
                src="/images/logo.png"
                alt="PetPalace Admin"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black">
              PetPalace Admin Portal
            </h1>
            <p className="text-gray-600 mt-2">
              Enter your credentials to access the dashboard
            </p>
          </div>
          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
              className={`mb-6 ${
                message.type === "error"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : "bg-green-50 text-green-800 border-green-200"
              }`}
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@petpalace.com"
                  className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-500/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-orange-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className="text-orange-500 border-gray-300 focus:ring-orange-500"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember me
                </Label>
              </div> */}
              {/* <button
                type="button"
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                onClick={() =>
                  setMessage({
                    type: "error",
                    text: "Please contact your system administrator to reset your password.",
                  })
                }
              >
                Forgot password?
              </button> */}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Secure admin access for authorized personnel only
              <br />© {new Date().getFullYear()} PetPalace. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Background Image with Orange & Blue Gradient */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <Package2 className="h-16 w-16 mx-auto mb-6 text-orange-100" />
            <h2 className="text-3xl font-bold mb-4">
              Welcome to PetPalace Admin
            </h2>
            <p className="text-white/80 mb-8">
              Manage your pet products, orders, and customers from one central
              dashboard. Monitor sales, update inventory, and ensure happy pets
              and owners.
            </p>
            {/* <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-100">500+</div>
                <div className="text-xs text-white/70">Products</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-100">10k+</div>
                <div className="text-xs text-white/70">Customers</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-100">99%</div>
                <div className="text-xs text-white/70">Happy Pets</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
