"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Address {
  _id?: string; // Optional for new addresses, required for updates
  name: string;
  phone: string;
  company?: string;
  address: string; // This will be line1 + line2 combined
  city: string;
  state: string;
  pincode: string;
  country: string;
  label: string;
  isDefault: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  initialAddress?: Address | null; // New prop for editing
}

export function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress,
}: AddressModalProps) {
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    company: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    country: "India",
    label: "Home",
    isDefault: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Effect to populate form when initialAddress changes (for editing)
  useEffect(() => {
    if (initialAddress) {
      const [firstName, ...lastNameParts] = initialAddress.name.split(" ");
      const lastName = lastNameParts.join(" ");

      // Attempt to split address into line1 and line2
      let line1 = initialAddress.address;
      let line2 = "";
      const addressParts = initialAddress.address.split(", ");
      if (addressParts.length > 1) {
        line1 = addressParts[0];
        line2 = addressParts.slice(1).join(", ");
      }

      setNewAddress({
        firstName: firstName || "",
        lastName: lastName || "",
        company: initialAddress.company || "",
        line1: line1,
        line2: line2,
        city: initialAddress.city,
        state: initialAddress.state,
        pincode: initialAddress.pincode,
        phone: initialAddress.phone,
        country: initialAddress.country,
        label: initialAddress.label,
        isDefault: initialAddress.isDefault,
      });
    } else {
      // Reset form when opening for adding
      setNewAddress({
        firstName: "",
        lastName: "",
        company: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        country: "India",
        label: "Home",
        isDefault: false,
      });
    }
    setErrors({}); // Clear errors on modal open/initialAddress change
  }, [initialAddress, isOpen]); // Depend on isOpen to reset when modal closes and reopens for add

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newAddress.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!newAddress.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!newAddress.line1.trim()) newErrors.line1 = "Address is required";
    if (!newAddress.city.trim()) newErrors.city = "City is required";
    if (!newAddress.state.trim()) newErrors.state = "State is required";
    if (!newAddress.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!newAddress.phone.trim()) newErrors.phone = "Phone is required";
    // Validate pincode format
    if (newAddress.pincode && !/^\d{6}$/.test(newAddress.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    // Validate phone format
    if (newAddress.phone && !/^[+]?[\d\s\-()]{10,15}$/.test(newAddress.phone)) {
      newErrors.phone = "Invalid phone number format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const payload: Address = {
        name: `${newAddress.firstName.trim()} ${newAddress.lastName.trim()}`,
        phone: newAddress.phone.trim(),
        company: newAddress.company.trim(),
        address: `${newAddress.line1.trim()}${
          newAddress.line2.trim() ? ", " + newAddress.line2.trim() : ""
        }`,
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        pincode: newAddress.pincode.trim(),
        country: newAddress.country.trim(),
        label: newAddress.label.trim(),
        isDefault: newAddress.isDefault,
      };

      const method = initialAddress ? "PUT" : "POST"; // Use PUT for update, POST for add
      const url = initialAddress
        ? `/api/users/addresses/update`
        : `/api/users/addresses/add`;

      if (initialAddress && initialAddress._id) {
        payload._id = initialAddress._id; // Add _id for update operation
      }

      console.log("Sending payload:", payload);
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok && data.success) {
        onSave(data.address); // Pass the updated/added address back
        onClose();
      } else {
        console.error("API Error:", data);
        alert(
          data.error ||
            `Failed to ${initialAddress ? "update" : "save"} address`
        );
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Error saving address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogDescription>
            {initialAddress
              ? "Update your address details."
              : "Add a new address to your account."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="firstName">First name *</Label>
            <Input
              id="firstName"
              value={newAddress.firstName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, firstName: e.target.value })
              }
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last name *</Label>
            <Input
              id="lastName"
              value={newAddress.lastName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, lastName: e.target.value })
              }
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={newAddress.company}
              onChange={(e) =>
                setNewAddress({ ...newAddress, company: e.target.value })
              }
              placeholder="Optional"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="line1">Address 1 *</Label>
            <Input
              id="line1"
              value={newAddress.line1}
              onChange={(e) =>
                setNewAddress({ ...newAddress, line1: e.target.value })
              }
              className={errors.line1 ? "border-red-500" : ""}
              placeholder="Street address"
            />
            {errors.line1 && (
              <p className="text-red-500 text-sm mt-1">{errors.line1}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="line2">Address 2</Label>
            <Input
              id="line2"
              value={newAddress.line2}
              onChange={(e) =>
                setNewAddress({ ...newAddress, line2: e.target.value })
              }
              placeholder="Apartment, suite, etc (optional)"
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <select
              id="state"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
              className={`w-full p-2 border rounded ${
                errors.state ? "border-red-500" : ""
              }`}
            >
              <option value="">Select State</option>
              <option value="Andaman and Nicobar Islands">
                Andaman and Nicobar Islands
              </option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Delhi">Delhi</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
          <div>
            <Label htmlFor="pincode">Postal/ZIP code *</Label>
            <Input
              id="pincode"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              className={errors.pincode ? "border-red-500" : ""}
              placeholder="6 digits"
              maxLength={6}
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
              className={errors.phone ? "border-red-500" : ""}
              placeholder="Contact number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="label">Address Label</Label>
            <select
              id="label"
              value={newAddress.label}
              onChange={(e) =>
                setNewAddress({ ...newAddress, label: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex items-center mt-4 gap-2">
          <input
            type="checkbox"
            id="default"
            checked={newAddress.isDefault}
            onChange={(e) =>
              setNewAddress({ ...newAddress, isDefault: e.target.checked })
            }
            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
          />
          <Label htmlFor="default" className="text-sm cursor-pointer">
            Set as default address
          </Label>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isLoading
              ? initialAddress
                ? "Updating..."
                : "Saving..."
              : initialAddress
              ? "Update"
              : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
