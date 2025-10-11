"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  MapPin,
  Shield,
  Check,
  Plus,
  Gift,
  Tag,
  Phone,
  Home,
  Building,
  Trash2,
  PawPrint,
} from "lucide-react";
import Image from "next/image";
import {
  isAuthenticated,
  getUserId,
  getCart,
} from "@/lib/services/cart-service";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  variant?: string;
  variantLabel?: string;
  foodType?: "veg" | "non-veg";
}

interface Pet {
  name: string;
  type: "Dog" | "Cat" | "Other";
  breed: string;
  age: string;
  birthdate: string;
}

interface Address {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  label: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [pets, setPets] = useState<Pet[]>([
    { name: "", type: "Dog", breed: "", age: "", birthdate: "" },
  ]);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [placing, setPlacing] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [newAddress, setNewAddress] = useState<Address>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    label: "Home",
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("[v0] User not authenticated, redirecting to sign-in");
      toast.error("Please login to continue");
      router.push("/sign-in?redirect=/checkout");
      return;
    }

    const loadCheckoutData = async () => {
      try {
        console.log("[v0] Loading checkout data for authenticated user");

        const userResponse = await fetch("/api/users/me");
        const userData = await userResponse.json();

        console.log("[v0] User data response:", userData);

        if (userData.authenticated && userData.user) {
          setUser(userData.user);
          setEmail(userData.user.email || "");
          setPhone(userData.user.number || "");

          if (userData.user.addresses && userData.user.addresses.length > 0) {
            const defaultAddr = userData.user.addresses.find(
              (a: Address) => a.isDefault
            );
            setSelectedAddress(
              defaultAddr?._id || userData.user.addresses[0]._id
            );
          } else {
            setShowAddressForm(true);
          }

          if (userData.user.pets && userData.user.pets.length > 0) {
            const existingPets = userData.user.pets.map((p: any) => ({
              name: p.name,
              type: p.type,
              breed: p.breed || "",
              age: "",
              birthdate: p.dob
                ? new Date(p.dob).toISOString().split("T")[0]
                : "",
            }));
            setPets(existingPets);
          }
        } else {
          console.error("[v0] User not authenticated or data missing");
          toast.error("Failed to load user data. Please login again.");
          router.push("/sign-in?redirect=/checkout");
          return;
        }

        const userId = getUserId();
        console.log("[v0] Loading cart for userId:", userId);

        if (userId && !userId.startsWith("guest_")) {
          // Authenticated user: load from database
          try {
            const cartResponse = await fetch(
              `/api/cart?userId=${encodeURIComponent(userId)}`,
              {
                cache: "no-store",
              }
            );
            const cartData = await cartResponse.json();

            console.log("[v0] Cart data from database:", cartData);

            if (
              cartData.success &&
              Array.isArray(cartData.items) &&
              cartData.items.length > 0
            ) {
              const mappedItems = cartData.items.map(
                (item: any, index: number) => ({
                  id: `${item.productId}-${item.variantId || ""}-${
                    item.packId || ""
                  }-${index}`,
                  name: item.name || item.productName || "Product",
                  price: item.price || 0,
                  originalPrice: item.originalPrice,
                  image: item.image || item.productImage || "/placeholder.svg",
                  quantity: item.quantity || 1,
                  category: item.brand || item.category || "Product",
                  variant: item.variantLabel || item.variant,
                  variantLabel: item.variantLabel || item.variant,
                  foodType: item.foodType,
                })
              );
              setCartItems(mappedItems);
              console.log(
                "[v0] Loaded cart items from database:",
                mappedItems.length
              );
            } else {
              console.log("[v0] No items in database cart");
              setCartItems([]);
            }
          } catch (error) {
            console.error("[v0] Error loading cart from database:", error);
            // Fallback to cookies if database fails
            const cookieCart = getCart();
            const mappedItems = cookieCart.map((item, index) => ({
              id: `${item.productId}-${index}`,
              name: item.name,
              price: item.price,
              originalPrice: undefined,
              image: item.image || "/placeholder.svg",
              quantity: item.quantity,
              category: item.brand || "Product",
              variant: item.variantLabel,
              variantLabel: item.variantLabel,
              foodType: item.foodType,
            }));
            setCartItems(mappedItems);
            console.log(
              "[v0] Loaded cart items from cookies (fallback):",
              mappedItems.length
            );
          }
        } else {
          // Guest user: load from cookies
          const cart = getCart();
          const mappedItems = cart.map((item, index) => ({
            id: `${item.productId}-${index}`,
            name: item.name,
            price: item.price,
            originalPrice: undefined,
            image: item.image || "/placeholder.svg",
            quantity: item.quantity,
            category: item.brand || "Product",
            variant: item.variantLabel,
            variantLabel: item.variantLabel,
            foodType: item.foodType,
          }));
          setCartItems(mappedItems);
          console.log(
            "[v0] Loaded cart items from cookies:",
            mappedItems.length
          );
        }
      } catch (error) {
        console.error("[v0] Error loading checkout data:", error);
        toast.error("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [router]);

  const addPet = () => {
    setPets([
      ...pets,
      { name: "", type: "Dog", breed: "", age: "", birthdate: "" },
    ]);
  };

  const removePet = (index: number) => {
    if (pets.length > 1) {
      setPets(pets.filter((_, i) => i !== index));
    }
  };

  const updatePet = (index: number, field: keyof Pet, value: string) => {
    const updatedPets = [...pets];
    updatedPets[index] = { ...updatedPets[index], [field]: value };
    setPets(updatedPets);
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      const response = await fetch("/api/offers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: promoCode,
          cartValue: subtotal,
          productIds: cartItems.map((item) => item.id),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsPromoApplied(true);
        setPromoDiscount(data.data.discount);
        toast.success(`Coupon ${data.data.couponCode} applied successfully!`);
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      toast.error("Failed to apply coupon code");
    }
  };

  const placeOrder = async () => {
    if (!email || !phone) {
      toast.error("Please provide contact details");
      return;
    }

    if (!selectedAddress && !showAddressForm) {
      toast.error("Please select a delivery address");
      return;
    }

    if (showAddressForm) {
      if (
        !newAddress.name ||
        !newAddress.phone ||
        !newAddress.address ||
        !newAddress.city ||
        !newAddress.state ||
        !newAddress.pincode
      ) {
        toast.error("Please fill all address fields");
        return;
      }
    }

    const validPets = pets.filter((p) => p.name && p.type);
    if (validPets.length === 0) {
      toast.error("Please add at least one pet detail");
      return;
    }

    setPlacing(true);

    try {
      const userId = getUserId();

      let addressData;
      if (showAddressForm) {
        addressData = {
          name: newAddress.name,
          phone: newAddress.phone,
          email: email,
          address: newAddress.address,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
          landmark: newAddress.landmark,
        };
      } else {
        const selectedAddr = user.addresses.find(
          (a: Address) => a._id === selectedAddress
        );
        addressData = {
          name: selectedAddr.name,
          phone: selectedAddr.phone,
          email: email,
          address: selectedAddr.address,
          city: selectedAddr.city,
          state: selectedAddr.state,
          pincode: selectedAddr.pincode,
          landmark: selectedAddr.landmark,
        };
      }

      const orderData = {
        userId,
        items: cartItems.map((item) => ({
          productId: item.id.split("-")[0],
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variantLabel: item.variantLabel,
          foodType: item.foodType,
        })),
        pets: validPets.map((pet) => ({
          name: pet.name,
          type: pet.type,
          breed: pet.breed,
          age: pet.age ? Number.parseInt(pet.age) : undefined,
          birthdate: pet.birthdate || undefined,
        })),
        address: addressData,
        subtotal,
        deliveryFee,
        discount: promoDiscount,
        total,
        paymentMethod: "cod",
        couponCode: isPromoApplied ? promoCode : undefined,
      };

      console.log("[v0] Placing order with data:", orderData);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("[v0] Order API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[v0] Order API error response:", errorText);
        throw new Error(`Failed to place order: ${response.status}`);
      }

      const data = await response.json();
      console.log("[v0] Order API response data:", data);

      if (data.success) {
        toast.success("Order placed successfully!");

        try {
          // Clear cart from database for authenticated users
          if (userId && !userId.startsWith("guest_")) {
            await fetch("/api/cart/clear", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            });
          }
          // Clear cart from cookies and localStorage
          document.cookie =
            "cart=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
          localStorage.removeItem("cart");
          localStorage.removeItem("cartCount");
          // Dispatch cart updated event to update header
          window.dispatchEvent(
            new CustomEvent("cartUpdated", { detail: { count: 0 } })
          );
        } catch (error) {
          console.error("[v0] Error clearing cart:", error);
        }

        router.push(
          `/order-success?orderId=${data.data._id}&orderNumber=${data.data.orderNumber}`
        );
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error: any) {
      console.error("[v0] Error placing order:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

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
  const total = subtotal + deliveryFee - promoDiscount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Continue Shopping
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                  {user?.addresses &&
                    user.addresses.length > 0 &&
                    !showAddressForm && (
                      <div className="space-y-4 mb-6">
                        <RadioGroup
                          value={selectedAddress}
                          onValueChange={setSelectedAddress}
                        >
                          {user.addresses.map((addr: Address) => (
                            <div
                              key={addr._id}
                              className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                            >
                              <RadioGroupItem
                                value={addr._id!}
                                id={addr._id}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={addr._id}
                                  className="flex items-center gap-2 font-medium cursor-pointer"
                                >
                                  {addr.label === "Home" ? (
                                    <Home className="w-4 h-4" />
                                  ) : (
                                    <Building className="w-4 h-4" />
                                  )}
                                  {addr.label}
                                  {addr.isDefault && (
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                                      Default
                                    </Badge>
                                  )}
                                </Label>
                                <p className="text-sm text-gray-600 mt-1">
                                  {addr.address}, {addr.city}, {addr.state} -{" "}
                                  {addr.pincode}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {addr.name} • {addr.phone}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>

                        <Button
                          variant="outline"
                          onClick={() => setShowAddressForm(true)}
                          className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Address
                        </Button>
                      </div>
                    )}

                  {/* New Address Form */}
                  {(showAddressForm ||
                    !user?.addresses ||
                    user.addresses.length === 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter full name"
                          value={newAddress.name}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              name: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="addressPhone">Phone Number</Label>
                        <Input
                          id="addressPhone"
                          placeholder="+91 98765 43210"
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              phone: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="label">Address Label</Label>
                        <Select
                          value={newAddress.label}
                          onValueChange={(value) =>
                            setNewAddress({ ...newAddress, label: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home">Home</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          placeholder="House/Flat no, Building name, Street"
                          value={newAddress.address}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              address: e.target.value,
                            })
                          }
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              city: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="560001"
                          value={newAddress.pincode}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              pincode: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="Karnataka"
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              state: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="landmark">Landmark (Optional)</Label>
                        <Input
                          id="landmark"
                          placeholder="Near metro station"
                          value={newAddress.landmark}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              landmark: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      {user?.addresses && user.addresses.length > 0 && (
                        <div className="md:col-span-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowAddressForm(false)}
                            className="w-full"
                          >
                            Use Saved Address
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pet Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <PawPrint className="w-5 h-5 text-orange-600" />
                    Pet Details
                  </h2>

                  <div className="space-y-6">
                    {pets.map((pet, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">
                            Pet {index + 1}
                          </h3>
                          {pets.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePet(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`petName-${index}`}>Pet Name</Label>
                            <Input
                              id={`petName-${index}`}
                              placeholder="e.g., Max"
                              value={pet.name}
                              onChange={(e) =>
                                updatePet(index, "name", e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`petType-${index}`}>Pet Type</Label>
                            <Select
                              value={pet.type}
                              onValueChange={(value) =>
                                updatePet(index, "type", value)
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Dog">Dog</SelectItem>
                                <SelectItem value="Cat">Cat</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`breed-${index}`}>Breed</Label>
                            <Input
                              id={`breed-${index}`}
                              placeholder="e.g., Golden Retriever"
                              value={pet.breed}
                              onChange={(e) =>
                                updatePet(index, "breed", e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`age-${index}`}>Age (years)</Label>
                            <Input
                              id={`age-${index}`}
                              type="number"
                              placeholder="e.g., 3"
                              value={pet.age}
                              onChange={(e) =>
                                updatePet(index, "age", e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`birthdate-${index}`}>
                              Birthdate (Optional)
                            </Label>
                            <Input
                              id={`birthdate-${index}`}
                              type="date"
                              value={pet.birthdate}
                              onChange={(e) =>
                                updatePet(index, "birthdate", e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addPet}
                      className="w-full border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add More Pet
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Payment Method
                  </h2>
                  <div className="p-4 border border-gray-200 rounded-lg bg-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-600">
                          Pay when you receive your order
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Online payment options will be available soon!
                  </p>
                </CardContent>
              </Card>

              <Button
                onClick={placeOrder}
                disabled={placing}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg rounded-xl"
              >
                {placing ? "Placing Order..." : "Place Order"}
                <Check className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
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
                          Promo code applied!
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
                      <div className="bg-orange-50 p-3 rounded-lg">
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
                          text: "Secure checkout",
                          color: "text-green-600",
                        },
                        {
                          icon: Check,
                          text: "Cash on Delivery",
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
