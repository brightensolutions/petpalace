// lib/scripts/seedCategories.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import Category from "../../lib/models/Category";

dotenv.config({ path: ".env" });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";
if (!MONGO_URI) {
  console.error("MONGODB connection string not found in .env (MONGODB_URI).");
  process.exit(1);
}

const menuData: Record<string, Record<string, string[]>> = {
  Cats: {
    "Cat Food": ["Dry Food", "Wet Food", "Kitten Food", "Premium Food"],
    "Cat Litter": [
      "Litter",
      "Litter Boxes & Toilets",
      "Cleaning & Deodorizers",
      "Scooper & Waste Disposal",
      "Scented Litter",
      "Unscented Litter",
    ],
    "Cat Toys": [
      "Cat Teasers",
      "Ball & Chaser Toys",
      "Catnip Toys",
      "Plush Toys",
      "Cat Trees & Scratchers",
      "Smart & Interactive Toys",
    ],
    "Cat Grooming": [
      "Shampoos & Conditioners",
      "Brushes & Combs",
      "Paw & Nail Care",
      "Ear & Eye Care",
      "Trimmers & Nail Clippers",
      "Grooming Tools",
    ],
    "Cat Clothing": [
      "Raincoats",
      "Bells & Tags",
      "Dresses",
      "T-shirts & Shirts",
      "Bandanas & Bowties",
      "Jackets & Sweaters",
    ],
    "Cat Accessories": [
      "GPS Tracker",
      "Collars",
      "Leashes",
      "Harnesses",
      "Carriers & Travel",
      "Beds & Furniture",
    ],
  },
  Dogs: {
    "Dog Food": [
      "Dry Food",
      "Wet Food",
      "Puppy Food",
      "Premium Food",
      "Senior Dog Food",
      "Grain Free Food",
    ],
    "Dog Treats": [
      "Training Treats",
      "Dental Treats",
      "Natural Treats",
      "Biscuits & Cookies",
      "Jerky Treats",
      "Bones & Chews",
    ],
    "Dog Toys": [
      "Rope Toys",
      "Ball Toys",
      "Squeaky Toys",
      "Puzzle Toys",
      "Plush Toys",
      "Interactive Toys",
    ],
    "Dog Grooming": [
      "Shampoos & Conditioners",
      "Brushes & Combs",
      "Nail Clippers",
      "Ear Care",
      "Dental Care",
      "Grooming Tools",
    ],
    "Dog Clothing": [
      "Sweaters & Hoodies",
      "Raincoats",
      "Bandanas",
      "Costumes",
      "Boots & Shoes",
      "Jackets",
    ],
    "Dog Accessories": [
      "Leashes & Collars",
      "Harnesses",
      "ID Tags",
      "Travel Carriers",
      "Dog Beds",
      "Bowls & Feeders",
    ],
  },
  "Other Pets": {
    Birds: ["Bird Food", "Bird Cages", "Bird Toys", "Bird Treats"],
    Fish: [
      "Fish Food",
      "Aquarium Supplies",
      "Fish Tank Accessories",
      "Water Care",
    ],
    "SMALL ANIMALS": [
      "Rabbit Food",
      "Hamster Food",
      "Guinea Pig Supplies",
      "Small Pet Toys",
    ],
    Reptiles: [
      "Reptile Food",
      "Terrariums",
      "Heating & Lighting",
      "Reptile Accessories",
    ],
  },
  Pharmacy: {
    "HEALTH CARE": [
      "Vitamins & Supplements",
      "Flea & Tick Control",
      "Dental Care",
      "Joint Care",
    ],
    Prescription: [
      "Prescription Medicines",
      "Vet Prescribed Items",
      "Medical Supplies",
    ],
    Wellness: [
      "Digestive Health",
      "Skin Care",
      "Eye & Ear Care",
      "Calming Aids",
    ],
  },
  "Shop by Brand": {
    "Premium Brands": [
      "Royal Canin",
      "Hills",
      "Purina Pro Plan",
      "Orijen",
      "Acana",
      "Farmina",
    ],
    "Popular Brands": [
      "Pedigree",
      "Whiskas",
      "Drools",
      "Sheba",
      "Felix",
      "Me-O",
    ],
    "Speciality Brands": [
      "Blue Buffalo",
      "Wellness",
      "Taste of the Wild",
      "Canidae",
    ],
  },
  "Pet Consultation": {
    "Vet Services": [
      "Online Consultation",
      "Health Check-up",
      "Vaccination Guidance",
      "Emergency Care",
    ],
    Training: [
      "Behavior Training",
      "Obedience Training",
      "Puppy Training",
      "Cat Training",
    ],
    Grooming: [
      "Professional Grooming",
      "Mobile Grooming",
      "Grooming Tips",
      "Nail Trimming",
    ],
  },
};

async function seedCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Sync schema indexes with DB (this will remove old indexes not in the schema)
    await Category.syncIndexes();
    console.log("🔧 Indexes synced (old indexes dropped if necessary).");

    // Optional: clear existing documents so the seed is reproducible
    await Category.deleteMany({});
    console.log("🗑️ Cleared existing categories.");

    for (const [mainName, subcats] of Object.entries(menuData)) {
      const main = await Category.create({
        name: mainName,
        slug: slugify(mainName, { lower: true, strict: true }),
        parentId: null,
      });

      for (const [subName, items] of Object.entries(subcats)) {
        const sub = await Category.create({
          name: subName,
          slug: slugify(subName, { lower: true, strict: true }),
          parentId: main._id,
        });

        if (Array.isArray(items)) {
          for (const itemName of items) {
            await Category.create({
              name: itemName,
              slug: slugify(itemName, { lower: true, strict: true }),
              parentId: sub._id,
            });
          }
        }
      }
    }

    console.log("✅ Categories seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedCategories();
