"use client";

import { useState, useEffect, useCallback } from "react";

interface WishlistItem {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  addedAt: string;
}

interface UseWishlistProps {
  userId?: string;
}

interface UseWishlistReturn {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<{
    added: boolean;
    requiresAuth: boolean;
  }>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isLoaded: boolean;
}

export function useWishlist({ userId }: UseWishlistProps): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        const localWishlist = localStorage.getItem("wishlist");
        if (localWishlist) {
          try {
            setWishlist(JSON.parse(localWishlist));
          } catch (error) {
            console.error("Error parsing local wishlist:", error);
          }
        }
        setIsLoaded(true);
        return;
      }

      try {
        const response = await fetch("/api/wishlist", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setWishlist(data.items || []);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchWishlist();
  }, [userId]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.productId === productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!userId) {
        const isCurrentlyInWishlist = isInWishlist(productId);
        let newWishlist: WishlistItem[];

        if (isCurrentlyInWishlist) {
          newWishlist = wishlist.filter((w) => w.productId !== productId);
        } else {
          newWishlist = [
            ...wishlist,
            {
              productId,
              productName: "",
              productImage: "",
              productPrice: 0,
              addedAt: new Date().toISOString(),
            },
          ];
        }

        setWishlist(newWishlist);
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));

        return {
          added: !isCurrentlyInWishlist,
          requiresAuth: false,
        };
      }

      try {
        const isCurrentlyInWishlist = isInWishlist(productId);
        const method = isCurrentlyInWishlist ? "DELETE" : "POST";

        const response = await fetch("/api/wishlist", {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          const data = await response.json();
          setWishlist(data.items || []);

          return {
            added: !isCurrentlyInWishlist,
            requiresAuth: false,
          };
        } else if (response.status === 401) {
          return {
            added: false,
            requiresAuth: true,
          };
        }

        throw new Error("Failed to update wishlist");
      } catch (error) {
        console.error("Error toggling wishlist:", error);
        return {
          added: false,
          requiresAuth: false,
        };
      }
    },
    [userId, wishlist, isInWishlist]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!userId) {
        const newWishlist = wishlist.filter(
          (item) => item.productId !== productId
        );
        setWishlist(newWishlist);
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));
        return;
      }

      try {
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          const data = await response.json();
          setWishlist(data.items || []);
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    },
    [userId, wishlist]
  );

  return {
    wishlist,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    isLoaded,
  };
}
