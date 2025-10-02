"use client";

import { useState, useEffect } from "react";

export interface WishlistItem {
  productId: string; // always MongoDB ObjectId string
  productName: string;
  productImage: string;
  productPrice: number;
  addedAt: string;
}

interface UseWishlistOptions {
  userId?: string;
}

export function useWishlist(options: UseWishlistOptions = {}) {
  const { userId } = options;
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (userId) {
        try {
          console.log("[v0] Loading wishlist from database for user:", userId);
          const response = await fetch(`/api/wishlist?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            const items = data.items.map((item: any) => ({
              productId: String(item.productId?._id || item.productId), // ✅ enforce ObjectId string
              productName: item.productId?.name || item.productName,
              productImage: item.productId?.main_image || item.productImage,
              productPrice: item.productId?.base_price || item.productPrice,
              addedAt: item.createdAt,
            }));
            setWishlistItems(items);
          }
        } catch (error) {
          console.error("[v0] Error loading wishlist from database:", error);
        }
      }
      setIsLoaded(true);
    };

    loadWishlist();
  }, [userId]);

  const addToWishlist = async (item: WishlistItem) => {
    console.log("[v0] addToWishlist called with:", item);
    console.log("[v0] productId being sent:", item.productId); // Added debug log

    if (!userId) {
      return { requiresAuth: true };
    }

    // Prevent duplicates
    if (wishlistItems.some((i) => i.productId === item.productId)) {
      console.log("[v0] Item already in wishlist, skipping");
      return { requiresAuth: false };
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: item.productId, // ✅ Now sending MongoDB ObjectId string
        }),
      });

      const responseData = await response.json();
      console.log("[v0] API response:", response.status, responseData);

      if (response.ok) {
        setWishlistItems((prev) => [
          ...prev,
          { ...item, addedAt: new Date().toISOString() },
        ]);
        return { requiresAuth: false };
      } else {
        console.error("[v0] API error:", responseData);
      }
      return { requiresAuth: false };
    } catch (error) {
      console.error("[v0] Error adding to wishlist:", error);
      return { requiresAuth: false };
    }
  };

  const removeFromWishlist = async (productId: string) => {
    console.log("[v0] removeFromWishlist called for productId:", productId);

    if (!userId) {
      return { requiresAuth: true };
    }

    try {
      const response = await fetch(
        `/api/wishlist?productId=${productId}&userId=${userId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
        return { requiresAuth: false };
      }
      return { requiresAuth: false };
    } catch (error) {
      console.error("[v0] Error removing from wishlist:", error);
      return { requiresAuth: false };
    }
  };

  const isInWishlist = (productId: string) =>
    wishlistItems.some((item) => item.productId === productId);

  const toggleWishlist = async (item: WishlistItem) => {
    console.log("[v0] toggleWishlist called with:", item);

    if (!userId) {
      return { added: false, requiresAuth: true };
    }

    if (isInWishlist(item.productId)) {
      console.log("[v0] Item is in wishlist, removing...");
      const result = await removeFromWishlist(item.productId);
      return { added: false, requiresAuth: result?.requiresAuth || false };
    } else {
      console.log("[v0] Item not in wishlist, adding...");
      const result = await addToWishlist(item);
      return { added: true, requiresAuth: result?.requiresAuth || false };
    }
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist: () => setWishlistItems([]),
    wishlistCount: wishlistItems.length,
    isLoaded,
  };
}
