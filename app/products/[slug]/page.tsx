import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import ProductClient from "./product-client";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db/db";
import Product from "@/lib/models/Product";
import ProductVariant from "@/lib/models/ProductVariant";
import OfferModel from "@/lib/models/Offer";

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

interface ProductData {
  id: string;
  slug: string;
  brand: string;
  name: string;
  rating: number;
  reviews: number;
  images: string[];
  packs: Pack[];
  variantsByType: { [key: string]: any[] };
  offers: any[];
  features: Feature[];
  customerReviews: CustomerReview[];
}

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  slug: string;
  brand: string;
}

async function getProduct(slug: string) {
  try {
    await dbConnect();

    const dbProduct = (await Product.findOne({ slug })
      .populate("brand")
      .populate("category")
      .lean()) as any;

    if (!dbProduct) {
      return null;
    }

    // Fetch variants for this product
    const variants = await ProductVariant.find({
      product_id: dbProduct._id,
    }).lean();

    return { ...dbProduct, variants };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getProductOffers(productId: string) {
  try {
    await dbConnect();

    const now = new Date();

    // Fetch active offers that are either global or applicable to this product
    const offers = await OfferModel.find({
      status: "active",
      $or: [
        { applicableProducts: { $size: 0 } }, // Global offers (empty array)
        { applicableProducts: { $exists: false } }, // Global offers (field doesn't exist)
        { applicableProducts: productId }, // Product-specific offers
      ],
      // $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }],
      // $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gte: now } }],
    })
      .limit(5)
      .lean();

    return offers.map((offer: any) => ({
      title:
        offer.description ||
        `${
          offer.type === "percentage"
            ? `${offer.value}% OFF`
            : `₹${offer.value} OFF`
        }${
          offer.minCartValue ? ` on orders above ₹${offer.minCartValue}` : ""
        }`,
      code: offer.couponCode,
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
    }));
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
}

async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit = 6
) {
  try {
    await dbConnect();

    const relatedProducts = await Product.find({
      category: categoryId,
      _id: { $ne: currentProductId },
    })
      .populate("brand")
      .limit(limit)
      .lean();

    // Fetch variants for each product to get pricing
    const productsWithVariants = await Promise.all(
      relatedProducts.map(async (product: any) => {
        const variants = await ProductVariant.find({
          product_id: product._id,
        }).lean();

        let price = product.base_price || product.mrp || 0;
        let originalPrice = product.mrp || product.base_price || 0;

        // Get price from first variant if available
        if (
          variants.length > 0 &&
          variants[0].packs &&
          variants[0].packs.length > 0
        ) {
          const firstPack = variants[0].packs[0];
          originalPrice = firstPack.price || originalPrice;
          const discountPercent = firstPack.discount_percent || 0;
          price = originalPrice * (1 - discountPercent / 100);
        }

        return {
          id: String(product._id),
          name: product.name,
          image: product.main_image || "/placeholder.svg",
          price,
          originalPrice,
          slug: product.slug,
          brand: product.brand?.name || "Unknown",
        };
      })
    );

    return productsWithVariants;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
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
      // Convert Mongoose document to plain object
      const plainVariant = JSON.parse(JSON.stringify(variant));

      if (!variantsByType[plainVariant.type]) {
        variantsByType[plainVariant.type] = [];
      }
      variantsByType[plainVariant.type].push(plainVariant);

      if (plainVariant.packs && plainVariant.packs.length > 0) {
        plainVariant.packs.forEach((pack: any) => {
          const originalPrice = pack.price || dbProduct.mrp || 0;
          const discountPercent = pack.discount_percent || 0;
          const salePrice = originalPrice * (1 - discountPercent / 100);

          packs.push({
            name: pack.label || plainVariant.label,
            discount: `${discountPercent}% off`,
            originalPrice,
            salePrice,
          });
        });
      } else if (plainVariant.price) {
        const originalPrice = plainVariant.price;
        const discountPercent = plainVariant.discount_percent || 0;
        const salePrice = originalPrice * (1 - discountPercent / 100);

        packs.push({
          name: plainVariant.label,
          discount: `${discountPercent}% off`,
          originalPrice,
          salePrice,
        });
      }
    });
  }

  if (packs.length === 0) {
    packs.push({
      name: "Single Pack",
      discount: "0% off",
      originalPrice: dbProduct.mrp || dbProduct.base_price || 0,
      salePrice: dbProduct.base_price || dbProduct.mrp || 0,
    });
  }

  const images = [dbProduct.main_image, ...(dbProduct.images || [])].filter(
    (img): img is string => Boolean(img)
  );

  const offers = await getProductOffers(String(dbProduct._id));

  const product: ProductData = {
    id: String(dbProduct._id),
    slug: resolvedParams.slug,
    brand: dbProduct.brand?.name || "Unknown Brand",
    name: dbProduct.name,
    rating: dbProduct.rating || 0,
    reviews: 0,
    images:
      images.length > 0
        ? images
        : ["/placeholder.svg?height=600&width=600&text=No+Image"],
    packs,
    variantsByType,
    offers, // Use fetched offers instead of hardcoded ones
    features: [
      { icon: "truck", text: "Enjoy Free Delivery above ₹699" },
      { icon: "rotate-ccw", text: "No Exchange & Returns" },
      { icon: "shield", text: "100% Authentic Products" },
    ],
    customerReviews: [],
  };

  const categoryId = dbProduct.category?._id || dbProduct.category;
  const relatedProducts = categoryId
    ? await getRelatedProducts(String(categoryId), String(dbProduct._id), 6)
    : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50/50 py-2">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.brand}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <ProductClient product={product} relatedProducts={relatedProducts} />

      <Footer />
    </div>
  );
}
