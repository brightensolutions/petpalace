import type { Address } from "./address";

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}
