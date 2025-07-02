"use client";

import { Card, CardContent } from "./ui/card";
import Image from "next/image";

export function CategoryGrid() {
  const categories = [
    {
      id: 1,
      name: "Dog Food",
      image: "/placeholder.svg?height=120&width=120&text=Dog+Food",
      color: "bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      id: 2,
      name: "Cat Food",
      image: "/placeholder.svg?height=120&width=120&text=Cat+Food",
      color: "bg-orange-100",
      textColor: "text-orange-700",
    },
    {
      id: 3,
      name: "Dog Toys",
      image: "/placeholder.svg?height=120&width=120&text=Dog+Toys",
      color: "bg-green-100",
      textColor: "text-green-700",
    },
    {
      id: 4,
      name: "Cat Toys",
      image: "/placeholder.svg?height=120&width=120&text=Cat+Toys",
      color: "bg-purple-100",
      textColor: "text-purple-700",
    },
    {
      id: 5,
      name: "Health Care",
      image: "/placeholder.svg?height=120&width=120&text=Health+Care",
      color: "bg-red-100",
      textColor: "text-red-700",
    },
    {
      id: 6,
      name: "Grooming",
      image: "/placeholder.svg?height=120&width=120&text=Grooming",
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
    },
    {
      id: 7,
      name: "Accessories",
      image: "/placeholder.svg?height=120&width=120&text=Accessories",
      color: "bg-pink-100",
      textColor: "text-pink-700",
    },
    {
      id: 8,
      name: "Treats",
      image: "/placeholder.svg?height=120&width=120&text=Treats",
      color: "bg-indigo-100",
      textColor: "text-indigo-700",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Find everything your pet needs in our organized categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-gray-50 hover:bg-white"
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-20 h-20 ${category.color} rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={120}
                    height={120}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3
                  className={`font-semibold text-base ${category.textColor} mb-1`}
                >
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
