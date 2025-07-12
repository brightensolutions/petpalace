export interface Address {
  _id?: string;
  name: string; // Full name
  phone: string; // Contact number
  company?: string; // Optional company name
  address: string; // Combined line1 + line2
  city: string;
  state: string;
  pincode: string;
  country: string;
  label: string; // e.g. Home, Work
  isDefault: boolean;
}

export interface CreateAddressRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
  isDefault?: boolean;
}
