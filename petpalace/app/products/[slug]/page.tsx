import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import ProductClient from "./product-client";

// Updated interface for Next.js 15 - params is now a Promise
interface ProductPageProps {
  params: Promise<{
    slug: string; // Changed from 'id' to 'slug' to match [slug] folder
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
  brand: string;
  name: string;
  rating: number;
  reviews: number;
  images: string[];
  packs: Pack[];
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

// Make the component async to handle Promise-based params
export default async function ProductPage({ params }: ProductPageProps) {
  // Await the params Promise
  const resolvedParams = await params;

  // Mock product data - will come from database in future
  const product: Product = {
    id: resolvedParams.slug, // Use slug instead of id
    brand: "Royal Canin",
    name: "Royal Canin Ultra Light Wet Cat Food - 85 g packs",
    rating: 4.8,
    reviews: 156,
    images: [
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Main+Product",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Back+View",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Ingredients",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Nutrition",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Usage",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Cat+Eating",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Package",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Size+Comparison",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Benefits",
      "/placeholder.svg?height=600&width=600&text=Royal+Canin+Feeding+Guide",
    ],
    packs: [
      {
        name: "Pack Of 1",
        discount: "12% off",
        originalPrice: 114.0,
        salePrice: 100.32,
      },
      {
        name: "Pack Of 4",
        discount: "12% off",
        originalPrice: 456.0,
        salePrice: 401.28,
      },
      {
        name: "Pack Of 8",
        discount: "12% off",
        originalPrice: 912.0,
        salePrice: 802.56,
      },
      {
        name: "Pack Of 12",
        discount: "12% off",
        originalPrice: 1368.0,
        salePrice: 1203.84,
      },
    ],
    offers: [
      {
        title: "Extra 3% OFF on Royal Canin No Minimum Cart Value",
        code: "HUFT3",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
      },
      {
        title: "Extra ₹150 OFF on orders above ₹2999",
        code: "EXT150",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      },
      {
        title: "Extra ₹150 off on orders above ₹2499",
        code: "SAVE150",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      },
    ],
    features: [
      { icon: "truck", text: "Enjoy Free Delivery above ₹699" },
      { icon: "rotate-ccw", text: "No Exchange & Returns" },
      { icon: "shield", text: "100% Authentic Products" },
    ],
    customerReviews: [
      {
        id: 1,
        name: "Priya Sharma",
        rating: 5,
        date: "2024-01-15",
        title: "Excellent quality food for my cat",
        comment:
          "My cat absolutely loves this food! The texture is perfect and she finishes her bowl every time. Great for weight management too.",
        helpful: 12,
        verified: true,
      },
      {
        id: 2,
        name: "Rajesh Kumar",
        rating: 4,
        date: "2024-01-10",
        title: "Good product but expensive",
        comment:
          "Quality is good and my cat likes it. However, it's quite expensive compared to other brands. The packaging is excellent.",
        helpful: 8,
        verified: true,
      },
      {
        id: 3,
        name: "Anita Patel",
        rating: 5,
        date: "2024-01-05",
        title: "Perfect for senior cats",
        comment:
          "My 12-year-old cat has been eating this for months now. It's easy to digest and she maintains a healthy weight.",
        helpful: 15,
        verified: true,
      },
      {
        id: 4,
        name: "Vikram Singh",
        rating: 4,
        date: "2023-12-28",
        title: "Cat loves the taste",
        comment:
          "Initially my cat was hesitant but now she loves it. Good quality ingredients and proper nutrition.",
        helpful: 6,
        verified: false,
      },
      {
        id: 5,
        name: "Meera Joshi",
        rating: 5,
        date: "2023-12-20",
        title: "Highly recommended",
        comment:
          "Best wet food for cats. My vet recommended this and I can see the difference in my cat's health.",
        helpful: 9,
        verified: true,
      },
      {
        id: 6,
        name: "Arjun Reddy",
        rating: 3,
        date: "2023-12-15",
        title: "Average product",
        comment:
          "It's okay but nothing special. My cat eats it but doesn't seem very excited about it.",
        helpful: 3,
        verified: true,
      },
    ],
  };

  const relatedProducts: RelatedProduct[] = [
    {
      id: 1,
      name: "Royal Canin Kitten Wet Food",
      image: "/placeholder.svg?height=200&width=200&text=Kitten+Food",
      price: 89.99,
      originalPrice: 99.99,
      discount: "Get Extra 5% OFF",
    },
    {
      id: 2,
      name: "Royal Canin Adult Cat Food",
      image: "/placeholder.svg?height=200&width=200&text=Adult+Cat+Food",
      price: 159.99,
      originalPrice: 179.99,
      discount: "Get Extra 5% OFF",
    },
    {
      id: 3,
      name: "Royal Canin Senior Cat Food",
      image: "/placeholder.svg?height=200&width=200&text=Senior+Cat+Food",
      price: 199.99,
      originalPrice: 229.99,
      discount: "Get Extra 5% OFF",
    },
  ];

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
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Pass data to client component for interactivity */}
      <ProductClient product={product} relatedProducts={relatedProducts} />

      <Footer />
    </div>
  );
}
