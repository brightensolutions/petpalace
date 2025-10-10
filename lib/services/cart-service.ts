export interface CartItem {
  productId: string;
  variantId?: string;
  packId?: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  brand?: string;
  variantLabel?: string;
  sku?: string;
  foodType?: "veg" | "non-veg";
}

// Simple cookie utilities using native browser APIs
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token =
    localStorage.getItem("authToken") ||
    getCookie("authToken") ||
    getCookie("token");
  return !!token;
};

// Get user ID from storage
export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId") || getCookie("userId") || null;
};

// Get cart from cookies (for non-authenticated users)
export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const cartData = getCookie("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error("Error getting cart:", error);
    return [];
  }
};

// Get cart item count
export const getCartItemCount = (): number => {
  try {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error("Error getting cart item count:", error);
    return 0;
  }
};

// Add item to cart
export const addToCart = async (item: CartItem): Promise<CartItem[]> => {
  try {
    console.log("[v0] Adding to cart:", item);

    // If user is authenticated, use API
    if (isAuthenticated()) {
      const userId = getUserId();
      console.log("[v0] User authenticated, userId:", userId);

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...item, userId }),
      });

      if (!response.ok) {
        console.error("[v0] Failed to add to cart via API");
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      console.log("[v0] Cart updated via API:", data);

      // Dispatch event to update cart icon
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return data.items;
    }

    // For non-authenticated users, use cookies
    const currentCart = getCart();

    // Check if item already exists in cart (same product, variant, and pack)
    const existingItemIndex = currentCart.findIndex(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.variantId === item.variantId &&
        cartItem.packId === item.packId
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      currentCart[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item if it doesn't exist
      currentCart.push(item);
    }

    // Save updated cart to cookies (expires in 7 days)
    setCookie("cart", JSON.stringify(currentCart), 7);

    // Dispatch event to update cart icon
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }

    return currentCart;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return getCart();
  }
};

// Update cart item quantity
export const updateCartItem = async (
  index: number,
  updates: Partial<CartItem>
): Promise<CartItem[]> => {
  try {
    // If user is authenticated, use API
    if (isAuthenticated()) {
      const currentCart = getCart();
      const item = currentCart[index];

      const response = await fetch("/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.productId,
          variantId: item.variantId,
          packId: item.packId,
          ...updates,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart item");
      }

      const data = await response.json();

      // Dispatch event to update cart icon
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return data.items;
    }

    // For non-authenticated users, use cookies
    const currentCart = getCart();

    if (index >= 0 && index < currentCart.length) {
      currentCart[index] = { ...currentCart[index], ...updates };
      setCookie("cart", JSON.stringify(currentCart), 7);

      // Dispatch event to update cart icon
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    }

    return currentCart;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return getCart();
  }
};

// Remove item from cart
export const removeFromCart = async (index: number): Promise<CartItem[]> => {
  try {
    const currentCart = getCart();
    const item = currentCart[index];

    // If user is authenticated, use API
    if (isAuthenticated()) {
      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.productId,
          variantId: item.variantId,
          packId: item.packId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      const data = await response.json();

      // Dispatch event to update cart icon
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return data.items;
    }

    // For non-authenticated users, use cookies
    if (index >= 0 && index < currentCart.length) {
      currentCart.splice(index, 1);
      setCookie("cart", JSON.stringify(currentCart), 7);

      // Dispatch event to update cart icon
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }
    }

    return currentCart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return getCart();
  }
};

// Clear entire cart
export const clearCart = async (): Promise<CartItem[]> => {
  try {
    // If user is authenticated, use API
    if (isAuthenticated()) {
      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      // Dispatch event to update cart icon
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return [];
    }

    // For non-authenticated users, use cookies
    removeCookie("cart");

    // Dispatch event to update cart icon
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }

    return [];
  } catch (error) {
    console.error("Error clearing cart:", error);
    return getCart();
  }
};

// Sync local cart to server after login
export const syncCartToServer = async (): Promise<void> => {
  try {
    const localCart = getCart();

    if (localCart.length === 0) return;

    const response = await fetch("/api/cart/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: localCart }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync cart");
    }

    // Clear local cart after successful sync
    removeCookie("cart");

    // Dispatch event to update cart icon
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  } catch (error) {
    console.error("Error syncing cart:", error);
  }
};

// React hook to use cart service in components
export const useCartService = () => {
  return {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCart,
    getCartItemCount,
    isAuthenticated,
    getUserId,
    syncCartToServer,
  };
};
