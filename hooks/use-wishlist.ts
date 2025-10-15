"use client";

import { useState, useEffect } from "react";
import { addToCart, type CartItem } from "@/lib/services/cart-service";

interface UseWishlistProps {
  userId?: string;
}

interface WishlistItem {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  addedAt?: string;
}

interface UseWishlistReturn {
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (
    productId: string
  ) => Promise<{ added: boolean; requiresAuth: boolean }>;
  isLoaded: boolean;
  wishlist: WishlistItem[];
  removeFromWishlist: (productId: string) => Promise<void>;
  addWishlistItemToCart: (
    productId: string,
    quantity?: number
  ) => Promise<void>;
}

export function useWishlist({ userId }: UseWishlistProps): UseWishlistReturn {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const pickImage = (p: any): string => {
    if (!p) return "";
    const candidate =
      p?.image ??
      p?.main_image ??
      (Array.isArray(p?.images) ? p.images[0] : undefined) ??
      p?.thumbnail ??
      p?.thumb ??
      "";
    if (typeof candidate === "string") return candidate;
    if (candidate && typeof candidate === "object") {
      // Support structures like { url }, { src }, { path }
      return candidate.url || candidate.src || candidate.path || "";
    }
    return "";
  };

  const pickName = (p: any): string =>
    p?.name || p?.title || p?.productName || p?.slug || "";

  const pickPrice = (p: any): number => {
    const n =
      p?.price ?? p?.base_price ?? p?.sale_price ?? p?.mrp ?? p?.amount ?? 0;
    const num = Number(n);
    return Number.isFinite(num) ? num : 0;
  };

  const normalizeWishlist = (payload: any): WishlistItem[] => {
    const list = payload?.items || payload?.wishlist || payload || [];
    console.log(
      "[v0][wishlist] normalizeWishlist input keys:",
      Object.keys(payload || {})
    );
    if (!Array.isArray(list)) {
      console.log(
        "[v0][wishlist] normalizeWishlist: list is not array, type:",
        typeof list
      );
      return [];
    }

    const normalized = list.map((w: any, idx: number) => {
      const productObj =
        (w?.productId && typeof w.productId === "object" && w.productId) ||
        (w?.product && typeof w.product === "object" && w.product) ||
        (Array.isArray(w?.products) && w.products[0]) ||
        w?.item ||
        (typeof w?.productId === "string" ? undefined : w);

      const derivedProductId =
        (typeof w?.productId === "string" && w.productId) ||
        productObj?._id ||
        w?.product?._id ||
        w?._id ||
        "";

      const name = w?.name || pickName(productObj);
      const image =
        typeof w?.image === "string"
          ? w.image
          : w?.image && typeof w.image === "object"
          ? w.image.url || w.image.src || ""
          : pickImage(productObj);
      const price =
        typeof w?.price === "number" ? w.price : pickPrice(productObj);

      if (idx === 0) {
        console.log("[v0][wishlist] sample item raw:", {
          keys: Object.keys(w || {}),
          productIsObj: !!productObj,
          productKeys: productObj ? Object.keys(productObj) : [],
        });
      }

      return {
        productId: String(derivedProductId || ""),
        productName: String(name || ""),
        productImage: String(image || ""),
        productPrice: Number(price || 0),
        addedAt: w?.createdAt || w?.addedAt || new Date().toISOString(),
      };
    });

    console.log(
      "[v0][wishlist] normalizeWishlist output length:",
      normalized.length
    );
    if (normalized[0]) {
      const sample = normalized[0];
      console.log("[v0][wishlist] normalizeWishlist sample:", {
        productId: sample.productId,
        productName: sample.productName,
        productImage: sample.productImage?.slice?.(0, 120),
        productPrice: sample.productPrice,
      });
    }
    return normalized;
  };

  const fetchWishlistData = async (): Promise<WishlistItem[]> => {
    const endpoints = ["/api/users/wishlist", "/api/wishlist"];
    for (const url of endpoints) {
      try {
        console.log("[v0][wishlist] fetching:", url);
        const res = await fetch(url, { credentials: "include" });
        console.log(
          "[v0][wishlist] response:",
          url,
          res.status,
          res.headers.get("content-type")
        );
        const text = await res
          .clone()
          .text()
          .catch(() => "");
        console.log(
          "[v0][wishlist] response text snippet:",
          text.slice(0, 200)
        );
        if (res.ok) {
          let data: any = {};
          try {
            data = await res.json();
          } catch (e) {
            console.warn("[v0][wishlist] JSON parse failed for", url, e);
            data = {};
          }
          console.log(
            "[v0][wishlist] raw payload keys:",
            Object.keys(data || {})
          );
          const items = normalizeWishlist(data);
          console.log("[v0][wishlist] normalized length:", items.length);
          return items;
        }
      } catch (err) {
        console.warn(
          "[v0][wishlist] fetch error for",
          url,
          (err as Error).message
        );
      }
    }
    return [];
  };

  const refetchWishlist = async () => {
    if (!userId) {
      console.log("[v0][wishlist] refetch aborted - no userId");
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }
    try {
      console.log("[v0][wishlist] refetch start for userId:", userId);
      const items = await fetchWishlistData();
      console.log("[v0][wishlist] refetch got items:", items.length);
      setWishlist(items);
      setWishlistIds(new Set(items.map((i) => i.productId)));
    } catch (e) {
      console.error("[v0][wishlist] Failed to refetch wishlist:", e);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.log("[v0][wishlist] load skipped - no userId");
      setIsLoaded(true);
      return;
    }

    const load = async () => {
      console.log("[v0][wishlist] initial load for userId:", userId);
      try {
        const items = await fetchWishlistData();
        console.log("[v0][wishlist] initial items length:", items.length);
        setWishlist(items);
        setWishlistIds(new Set(items.map((i) => i.productId)));
      } catch (error) {
        console.error(
          "[v0][wishlist] Failed to fetch wishlist:",
          (error as Error)?.message
        );
      } finally {
        setIsLoaded(true);
      }
    };

    load();
  }, [userId]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.has(productId);
  };

  const toggleWishlist = async (
    productId: string
  ): Promise<{ added: boolean; requiresAuth: boolean }> => {
    console.log("[v0][wishlist] toggleWishlist called:", { userId, productId });
    if (!userId) {
      console.log("[v0][wishlist] toggleWishlist requires auth");
      return { added: false, requiresAuth: true };
    }

    try {
      const isCurrentlyInWishlist = wishlistIds.has(productId);
      const method = isCurrentlyInWishlist ? "DELETE" : "POST";
      console.log("[v0][wishlist] toggleWishlist method:", method);

      const res = await fetch("/api/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      const snippet = await res
        .clone()
        .text()
        .catch(() => "");
      console.log(
        "[v0][wishlist] toggleWishlist response:",
        res.status,
        snippet.slice(0, 160)
      );

      if (res.ok) {
        await refetchWishlist();
        return { added: !isCurrentlyInWishlist, requiresAuth: false };
      }
    } catch (error) {
      console.error("[v0][wishlist] Toggle wishlist error:", error);
    }

    return { added: false, requiresAuth: false };
  };

  const removeFromWishlist = async (productId: string): Promise<void> => {
    console.log("[v0][wishlist] removeFromWishlist:", { userId, productId });
    if (!userId) return;
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      const snippet = await res
        .clone()
        .text()
        .catch(() => "");
      console.log(
        "[v0][wishlist] removeFromWishlist response:",
        res.status,
        snippet.slice(0, 160)
      );
      if (res.ok) {
        await refetchWishlist();
      }
    } catch (e) {
      console.error("[v0][wishlist] Error removing from wishlist:", e);
    }
  };

  const addWishlistItemToCart = async (
    productId: string,
    quantity = 1
  ): Promise<void> => {
    const item = wishlist.find((w) => w.productId === productId);
    console.log("[v0][wishlist] addWishlistItemToCart", {
      productId,
      found: !!item,
    });
    if (!item) return;
    const cartItem: CartItem = {
      productId: item.productId,
      quantity: Math.max(1, Number(quantity) || 1),
      price: Number(item.productPrice) || 0,
      name: item.productName || "Product",
      image: item.productImage || undefined,
    };
    console.log("[v0][wishlist] adding cart item:", cartItem);
    await addToCart(cartItem);
  };

  return {
    isInWishlist,
    toggleWishlist,
    isLoaded,
    wishlist,
    removeFromWishlist,
    addWishlistItemToCart,
  };
}
