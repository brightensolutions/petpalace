"use client";

import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export function CategoryShowcase() {
  const categories = [
    {
      id: 1,
      name: "Dog Food",
      image: "/placeholder.svg?height=200&width=300&text=Dog+Food+Products",
    },
    {
      id: 2,
      name: "Cat Food",
      image: "/placeholder.svg?height=200&width=300&text=Cat+Food+Products",
    },
    {
      id: 3,
      name: "Dog Toys",
      image: "/placeholder.svg?height=200&width=300&text=Dog+Toys+Products",
    },
    {
      id: 4,
      name: "Cat Toys",
      image: "/placeholder.svg?height=200&width=300&text=Cat+Toys+Products",
    },
    {
      id: 5,
      name: "Health Care",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Health+Products",
    },
    {
      id: 6,
      name: "Grooming",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Grooming+Products",
    },
    {
      id: 7,
      name: "Accessories",
      image:
        "/placeholder.svg?height=200&width=300&text=Pet+Accessories+Products",
    },
    {
      id: 8,
      name: "Treats",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Treats+Products",
    },
    {
      id: 9,
      name: "Beds & Furniture",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Beds+Products",
    },
    {
      id: 10,
      name: "Training",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Training+Products",
    },
    {
      id: 11,
      name: "Carriers",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Carriers+Products",
    },
    {
      id: 12,
      name: "Bowls & Feeders",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Bowls+Products",
    },
    {
      id: 13,
      name: "Leashes",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Leashes+Products",
    },
    {
      id: 14,
      name: "Collars",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Collars+Products",
    },
    {
      id: 15,
      name: "Cleaning",
      image: "/placeholder.svg?height=200&width=300&text=Pet+Cleaning+Products",
    },
    {
      id: 16,
      name: "Supplements",
      image:
        "/placeholder.svg?height=200&width=300&text=Pet+Supplements+Products",
    },
  ];

  // Split categories into two rows of 8 each
  const firstRow = categories.slice(0, 8);
  const secondRow = categories.slice(8, 16);

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-full px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Trending Add-To-Carts
          </h2>
          <p className="text-gray-600 text-lg">Were you looking for these?</p>
        </div>

        {/* Categories Grid - Two Rows of 8 */}
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {firstRow.map((category) => (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-orange-300 rounded-2xl overflow-hidden bg-white"
              >
                <CardContent className="p-0">
                  {/* Image Section */}
                  <div className="aspect-square bg-gradient-to-br from-orange-50 to-blue-50 p-4 flex items-center justify-center">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Category Name */}
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {secondRow.map((category) => (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-orange-300 rounded-2xl overflow-hidden bg-white"
              >
                <CardContent className="p-0">
                  {/* Image Section */}
                  <div className="aspect-square bg-gradient-to-br from-orange-50 to-blue-50 p-4 flex items-center justify-center">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Category Name */}
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryShowcase;
