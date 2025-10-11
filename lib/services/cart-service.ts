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
  const uid = localStorage.getItem("userId") || getCookie("userId");
  if (token) return true;
  if (!uid) return false;
  return !uid.startsWith("guest_");
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
  if (typeof window === "undefined") return 0;

  // For authenticated users, we can't get the count from cookies
  // So we use the persisted count from localStorage as a fallback
  if (isAuthenticated()) {
    try {
      const persisted = localStorage.getItem("cartCount");
      if (persisted !== null) {
        const n = Number(persisted);
        if (!Number.isNaN(n)) return n;
      }
    } catch {}
  }

  // For guest users, always read from cookies
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

const uuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const getOrCreateUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  let id = getUserId();
  if (!id) {
    id = `guest_${uuidv4()}`;
    try {
      localStorage.setItem("userId", id);
    } catch {}
    setCookie("userId", id, 365);
  }
  return id;
};

// Add item to cart
export const addToCart = async (item: CartItem): Promise<CartItem[]> => {
  try {
    console.log("[v0] Adding to cart:", item);

    // Guest/cookie-only mode
    if (!isAuthenticated()) {
      const currentCart = getCart();
      const idx = currentCart.findIndex(
        (c) =>
          c.productId === item.productId &&
          c.variantId === item.variantId &&
          c.packId === item.packId
      );
      if (idx !== -1) currentCart[idx].quantity += item.quantity;
      else currentCart.push(item);
      setCookie("cart", JSON.stringify(currentCart), 7);
      dispatchCartUpdated(computeCount(currentCart));
      return currentCart;
    }

    // Authenticated mode (unchanged)
    let userId = getUserId();
    if (!userId) userId = await ensureUserId();
    if (userId) {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, userId }),
      });
      if (!response.ok) throw new Error("API add failed");
      const data = await response.json();
      const items = extractItemsFromApi(data);
      dispatchCartUpdated(computeCount(items));
      return items as CartItem[];
    }

    // Fallback cookie if no userId resolved
    const fallbackCart = getCart();
    const fIdx = fallbackCart.findIndex(
      (c) =>
        c.productId === item.productId &&
        c.variantId === item.variantId &&
        c.packId === item.packId
    );
    if (fIdx !== -1) fallbackCart[fIdx].quantity += item.quantity;
    else fallbackCart.push(item);
    setCookie("cart", JSON.stringify(fallbackCart), 7);
    dispatchCartUpdated(computeCount(fallbackCart));
    return fallbackCart;
  } catch (error) {
    console.error("Error adding to cart:", error);
    const fallback = getCart();
    dispatchCartUpdated(computeCount(fallback));
    return fallback;
  }
};

// Update cart item quantity
export const updateCartItem = async (
  index: number,
  updates: Partial<CartItem>
): Promise<CartItem[]> => {
  try {
    const currentCart = getCart();
    const item = currentCart[index];

    if (isAuthenticated()) {
      let userId = getUserId();
      if (!userId) userId = await ensureUserId();

      if (userId) {
        const response = await fetch("/api/cart/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: item.productId,
            variantId: item.variantId,
            packId: item.packId,
            ...updates,
          }),
        });
        if (!response.ok) throw new Error("Failed to update cart item");
        const data = await response.json();
        const items = extractItemsFromApi(data);

        dispatchCartUpdated(computeCount(items));
        return items as CartItem[];
      }
    }

    // Cookie path
    if (index >= 0 && index < currentCart.length) {
      currentCart[index] = { ...currentCart[index], ...updates };
      setCookie("cart", JSON.stringify(currentCart), 7);
      dispatchCartUpdated(computeCount(currentCart));
    }
    return currentCart;
  } catch (error) {
    console.error("Error updating cart item:", error);
    const fallback = getCart();
    dispatchCartUpdated(computeCount(fallback));
    return fallback;
  }
};

// Remove item from cart
export const removeFromCart = async (
  indexOrItem:
    | number
    | { productId: string; variantId?: string; packId?: string }
): Promise<CartItem[]> => {
  try {
    // Handle both index (for backward compatibility) and item details
    let item: CartItem | undefined;
    let index = -1;

    if (typeof indexOrItem === "number") {
      // Legacy: index-based removal
      const currentCart = getCart();
      index = indexOrItem;

      if (index < 0 || index >= currentCart.length) {
        console.error(
          "[v0] Invalid cart index:",
          index,
          "Cart length:",
          currentCart.length
        );
        return currentCart;
      }

      item = currentCart[index];
    } else {
      // New: item-based removal (works for both guest and authenticated)
      item = indexOrItem as any;
      const currentCart = getCart();
      index = currentCart.findIndex(
        (c) =>
          c.productId === item!.productId &&
          c.variantId === item!.variantId &&
          c.packId === item!.packId
      );
    }

    if (!item) {
      console.error("[v0] Cart item is undefined");
      const fallback = getCart();
      return fallback;
    }

    if (isAuthenticated()) {
      let userId = getUserId();
      if (!userId) userId = await ensureUserId();

      if (userId) {
        const response = await fetch("/api/cart/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productId: item.productId,
            variantId: item.variantId,
            packId: item.packId,
          }),
        });
        if (!response.ok) throw new Error("Failed to remove item from cart");
        const data = await response.json();
        const items = extractItemsFromApi(data);

        dispatchCartUpdated(computeCount(items));
        return items as CartItem[];
      }
    }

    // Cookie path (for guest users)
    const currentCart = getCart();
    if (index >= 0 && index < currentCart.length) {
      currentCart.splice(index, 1);
      setCookie("cart", JSON.stringify(currentCart), 7);
      dispatchCartUpdated(computeCount(currentCart));
    }
    return currentCart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    const fallback = getCart();
    dispatchCartUpdated(computeCount(fallback));
    return fallback;
  }
};

// Clear entire cart
export const clearCart = async (): Promise<CartItem[]> => {
  try {
    if (isAuthenticated()) {
      let userId = getUserId();
      if (!userId) userId = await ensureUserId();
      if (!userId) {
        removeCookie("cart");
        dispatchCartUpdated(0);
        return [];
      }

      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error("Failed to clear cart");

      dispatchCartUpdated(0);
      return [];
    }

    // Cookie path
    removeCookie("cart");
    dispatchCartUpdated(0);
    return [];
  } catch (error) {
    console.error("Error clearing cart:", error);
    const fallback = getCart();
    dispatchCartUpdated(computeCount(fallback));
    return fallback;
  }
};

// Sync local cart to server after login
export const syncCartToServer = async (): Promise<void> => {
  try {
    const localCart = getCart();
    if (localCart.length === 0) return;

    let userId = getUserId();
    if (!userId) userId = await ensureUserId();
    if (!userId) return; // cannot sync without userId

    const response = await fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: localCart, userId }),
    });
    if (!response.ok) throw new Error("Failed to sync cart");

    removeCookie("cart");
    dispatchCartUpdated(computeCount(localCart));
  } catch (error) {
    console.error("Error syncing cart:", error);
  }
};

export const ensureUserId = async (): Promise<string | null> => {
  if (typeof window === "undefined") return null;
  // Try to detect authenticated user
  try {
    const res = await fetch("/api/users/me", {
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      const authId =
        data?.user?.id || data?.user?._id || data?.userId || data?.id;
      if (authId) {
        // If we were a guest, claim/merge into authenticated cart
        await claimGuestCartIfNeeded(authId);
        try {
          localStorage.setItem("userId", authId);
        } catch {}
        setCookie("userId", authId, 365);
        return authId;
      }
    }
  } catch {}

  // Fallback to whatever we have (guest or existing)
  const existing = getUserId();
  if (existing) return existing;
  const created = getOrCreateUserId();
  return created;
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
    ensureUserId,
    logoutCartReset,
  };
};

const computeCount = (items: Array<{ quantity?: number }> = []): number =>
  items.reduce((t, i) => t + (Number(i?.quantity ?? 0) || 0), 0);

const setPersistedCount = (count: number) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cartCount", String(count));
  } catch {}
};

const dispatchCartUpdated = (count: number) => {
  if (typeof window === "undefined") return;
  setPersistedCount(count);
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count } }));
};

type BasicCartItem = {
  productId: string;
  variantId?: string;
  packId?: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  brand?: string;
  variantLabel?: string;
  foodType?: "veg" | "non-veg";
};

const keyOf = (i: BasicCartItem) =>
  `${i.productId}::${i.variantId || ""}::${i.packId || ""}`;

const mergeItems = (items: BasicCartItem[]): BasicCartItem[] => {
  const map = new Map<string, BasicCartItem>();
  for (const it of items) {
    const k = keyOf(it);
    const found = map.get(k);
    if (found) {
      map.set(k, {
        ...found,
        quantity: (Number(found.quantity) || 0) + (Number(it.quantity) || 0),
      });
    } else {
      map.set(k, { ...it });
    }
  }
  return Array.from(map.values());
};

const fetchDbCart = async (userId: string): Promise<BasicCartItem[]> => {
  const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  return Array.isArray(data?.items) ? data.items : [];
};

/**
 * Claim any existing guest cart (DB + cookie) into the authenticated user's cart.
 * - Merges guest DB items and cookie items into auth cart
 * - Clears guest DB cart and cookie cart
 * - Persists auth userId to storage/cookie
 */
const claimGuestCartIfNeeded = async (authUserId: string): Promise<void> => {
  if (typeof window === "undefined") return;
  const current = getUserId();
  if (current && !current.startsWith("guest_")) return;
  try {
    const guestDbItems = current?.startsWith("guest_")
      ? await fetchDbCart(current)
      : [];
    const cookieItems = getCart();
    const merged = mergeItems([
      ...(guestDbItems as BasicCartItem[]),
      ...cookieItems,
    ]);

    // Sync merged items into auth cart
    await fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: authUserId, items: merged }),
    });

    // Clear guest DB cart
    if (current?.startsWith("guest_")) {
      await fetch("/api/cart/clear", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: current }),
      });
    }

    // Clear cookie cart and set new user id
    removeCookie("cart");
    try {
      localStorage.setItem("userId", authUserId);
    } catch {}
    setCookie("userId", authUserId, 365);

    dispatchCartUpdated(computeCount(merged));
  } catch (e) {
    console.warn(
      "[v0] claimGuestCartIfNeeded failed, proceeding without claim.",
      e
    );
  }
};

// Helper to clear persisted auth/cart state and a public logout reset
const clearPersistedUser = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartCount");
  } catch {}
  removeCookie("userId");
  removeCookie("token");
  removeCookie("authToken");
};

/**
 * Clears any persisted auth/cart identity and resets the header badge to 0.
 * Call this right after a successful sign-out.
 */
export const logoutCartReset = async (): Promise<void> => {
  clearPersistedUser();
  // Also clear any cookie cart residue so we don't show stale guest items
  removeCookie("cart");
  dispatchCartUpdated(0);
};

const extractItemsFromApi = (data: any): BasicCartItem[] => {
  const items = data?.items ?? data?.cart?.items ?? data?.data?.items ?? [];
  return Array.isArray(items) ? (items as BasicCartItem[]) : [];
};
