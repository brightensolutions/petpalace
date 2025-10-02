import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import ProductClient from "./product-client";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Pack {
  name: string;
  discount: string;
  originalPrice: number;
  salePrice: number;
}

interface Offer {
  title: string;
  code: string;
  bgColor: string;
  textColor: string;
}

interface Feature {
  icon: string;
  text: string;
}

interface CustomerReview {
  id: number;
  name: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  rating: number;
  reviews: number;
  images: string[];
  packs: Pack[];
  variantsByType: { [key: string]: any[] };
  offers: Offer[];
  features: Feature[];
  customerReviews: CustomerReview[];
}

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
}

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("[v0] Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const dbProduct = await getProduct(resolvedParams.slug);

  if (!dbProduct) {
    notFound();
  }

  const variantsByType: { [key: string]: any[] } = {};
  const packs: Pack[] = [];

  if (dbProduct.variants && dbProduct.variants.length > 0) {
    dbProduct.variants.forEach((variant: any) => {
      // Group variants by type
      if (!variantsByType[variant.type]) {
        variantsByType[variant.type] = [];
      }
      variantsByType[variant.type].push(variant);

      // Extract packs
      if (variant.packs && variant.packs.length > 0) {
        variant.packs.forEach((pack: any) => {
          const originalPrice = pack.price || dbProduct.mrp || 0;
          const discountPercent = pack.discount_percent || 0;
          const salePrice = originalPrice * (1 - discountPercent / 100);

          packs.push({
            name: pack.label || variant.label,
            discount: `${discountPercent}% off`,
            originalPrice,
            salePrice,
          });
        });
      } else if (variant.price) {
        // Single variant without packs
        const originalPrice = variant.price;
        const discountPercent = variant.discount_percent || 0;
        const salePrice = originalPrice * (1 - discountPercent / 100);

        packs.push({
          name: variant.label,
          discount: `${discountPercent}% off`,
          originalPrice,
          salePrice,
        });
      }
    });
  }

  // Fallback to base product price if no variants
  if (packs.length === 0) {
    packs.push({
      name: "Single Pack",
      discount: "0% off",
      originalPrice: dbProduct.mrp || dbProduct.base_price || 0,
      salePrice: dbProduct.base_price || dbProduct.mrp || 0,
    });
  }

  // Prepare images array
  const images = [dbProduct.main_image, ...(dbProduct.images || [])].filter(
    Boolean
  );

  const product: Product = {
    id: String(dbProduct._id), // ✅ Use MongoDB ObjectId
    slug: resolvedParams.slug, // Keep slug for URL purposes
    brand: dbProduct.brand?.name || "Unknown Brand",
    name: dbProduct.name,
    rating: 4.5,
    reviews: 0,
    images:
      images.length > 0
        ? images
        : ["/placeholder.svg?height=600&width=600&text=No+Image"],
    packs,
    variantsByType,
    offers: [
      {
        title: "Extra 3% OFF on orders above ₹999",
        code: "SAVE3",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
      },
      {
        title: "Extra ₹150 OFF on orders above ₹2999",
        code: "EXT150",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      },
    ],
    features: [
      { icon: "truck", text: "Enjoy Free Delivery above ₹699" },
      { icon: "rotate-ccw", text: "No Exchange & Returns" },
      { icon: "shield", text: "100% Authentic Products" },
    ],
    customerReviews: [],
  };

  const relatedProducts: RelatedProduct[] = [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50/50 py-2">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.brand}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <ProductClient product={product} relatedProducts={relatedProducts} />

      <Footer />
    </div>
  );
}
