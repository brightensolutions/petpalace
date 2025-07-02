// test/seedCategories.js

/**
 * Standalone Node.js script to seed the `categories` collection
 * with a 3-level hierarchy (categories → subcategories → sub-subcategories).
 *
 * Usage:
 *   node test/seedCategories.js
 * After it runs, you can safely delete this file.
 */

const { MongoClient } = require('mongodb');

// 1. Your MongoDB URI (uses default "PetPalace" database if none specified)
const uri = 'mongodb+srv://donisingh007:VtRmvtIn0U8pKItk@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';

// 2. The full hierarchical data
const categoriesMap = {
  Cats: {
    'CAT FOOD': ['Dry Food', 'Wet Food', 'Kitten Food', 'Premium Food'],
    'CAT LITTER': [
      'Litter',
      'Litter Boxes & Toilets',
      'Cleaning & Deodorizers',
      'Scooper & Waste Disposal',
      'Scented Litter',
      'Unscented Litter',
    ],
    'CAT TOYS': [
      'Cat Teasers',
      'Ball & Chaser Toys',
      'Catnip Toys',
      'Plush Toys',
      'Cat Trees & Scratchers',
      'Smart & Interactive Toys',
    ],
    'CAT GROOMING': [
      'Shampoos & Conditioners',
      'Brushes & Combs',
      'Paw & Nail Care',
      'Ear & Eye Care',
      'Trimmers & Nail Clippers',
      'Grooming Tools',
    ],
    'CAT CLOTHING': [
      'Raincoats',
      'Bells & Tags',
      'Dresses',
      'T-shirts & Shirts',
      'Bandanas & Bowties',
      'Jackets & Sweaters',
    ],
    'CAT ACCESSORIES': [
      'GPS Tracker',
      'Collars',
      'Leashes',
      'Harnesses',
      'Carriers & Travel',
      'Beds & Furniture',
    ],
  },
  Dogs: {
    'DOG FOOD': [
      'Dry Food',
      'Wet Food',
      'Puppy Food',
      'Premium Food',
      'Senior Dog Food',
      'Grain Free Food',
    ],
    'DOG TREATS': [
      'Training Treats',
      'Dental Treats',
      'Natural Treats',
      'Biscuits & Cookies',
      'Jerky Treats',
      'Bones & Chews',
    ],
    'DOG TOYS': [
      'Rope Toys',
      'Ball Toys',
      'Squeaky Toys',
      'Puzzle Toys',
      'Plush Toys',
      'Interactive Toys',
    ],
    'DOG GROOMING': [
      'Shampoos & Conditioners',
      'Brushes & Combs',
      'Nail Clippers',
      'Ear Care',
      'Dental Care',
      'Grooming Tools',
    ],
    'DOG CLOTHING': [
      'Sweaters & Hoodies',
      'Raincoats',
      'Bandanas',
      'Costumes',
      'Boots & Shoes',
      'Jackets',
    ],
    'DOG ACCESSORIES': [
      'Leashes & Collars',
      'Harnesses',
      'ID Tags',
      'Travel Carriers',
      'Dog Beds',
      'Bowls & Feeders',
    ],
  },
  'Other Pets': {
    BIRDS: ['Bird Food', 'Bird Cages', 'Bird Toys', 'Bird Treats'],
    FISH: ['Fish Food', 'Aquarium Supplies', 'Fish Tank Accessories', 'Water Care'],
    'SMALL ANIMALS': [
      'Rabbit Food',
      'Hamster Food',
      'Guinea Pig Supplies',
      'Small Pet Toys',
    ],
    REPTILES: [
      'Reptile Food',
      'Terrariums',
      'Heating & Lighting',
      'Reptile Accessories',
    ],
  },
  Pharmacy: {
    'HEALTH CARE': ['Vitamins & Supplements', 'Flea & Tick Control', 'Dental Care', 'Joint Care'],
    PRESCRIPTION: ['Prescription Medicines', 'Vet Prescribed Items', 'Medical Supplies'],
    WELLNESS: ['Digestive Health', 'Skin Care', 'Eye & Ear Care', 'Calming Aids'],
  },
  'Shop by Brand': {
    'PREMIUM BRANDS': ['Royal Canin', 'Hills', 'Purina Pro Plan', 'Orijen', 'Acana', 'Farmina'],
    'POPULAR BRANDS': ['Pedigree', 'Whiskas', 'Drools', 'Sheba', 'Felix', 'Me-O'],
    'SPECIALTY BRANDS': ['Blue Buffalo', 'Wellness', 'Taste of the Wild', 'Canidae'],
  },
  'Pet Consultation': {
    'VET SERVICES': ['Online Consultation', 'Health Check-up', 'Vaccination Guidance', 'Emergency Care'],
    TRAINING: ['Behavior Training', 'Obedience Training', 'Puppy Training', 'Cat Training'],
    GROOMING: ['Professional Grooming', 'Mobile Grooming', 'Grooming Tips', 'Nail Trimming'],
  },
};

// 3. Utility to generate URL-friendly slugs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/&/g, '-and-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')   // remove non-word chars
    .replace(/\-\-+/g, '-')     // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');    // trim hyphens off ends
}

async function run() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect
    await client.connect();
    console.log('🗄️  Connected to database');

    const db = client.db(); // default DB from URI
    const categories = db.collection('categories');

    // Drop existing to remove any old indexes
    try {
      await db.dropCollection('categories');
      console.log('🗑️  Dropped old categories collection');
    } catch {
      console.log('ℹ️  No existing categories collection to drop');
    }

    // Keep map of slug -> insertedId for parent lookup
    const slugToId = {};

    // 1) Insert top-level categories
    for (const topName of Object.keys(categoriesMap)) {
      const topSlug = slugify(topName);
      const res = await categories.insertOne({
        name: topName,
        slug: topSlug,
        parentId: null,
      });
      slugToId[topSlug] = res.insertedId;
      console.log(`✅ Inserted top-level: ${topName}`);
    }

    // 2) Insert sub-categories
    for (const [topName, subs] of Object.entries(categoriesMap)) {
      const topSlug = slugify(topName);
      for (const subName of Object.keys(subs)) {
        const subSlug = slugify(subName);
        const res = await categories.insertOne({
          name: subName,
          slug: subSlug,
          parentId: slugToId[topSlug],
        });
        slugToId[subSlug] = res.insertedId;
        console.log(`   ✅ Sub-category: ${subName}`);
      }
    }

    // 3) Insert leaf categories
    for (const subs of Object.values(categoriesMap)) {
      for (const [subName, leafArr] of Object.entries(subs)) {
        const subSlug = slugify(subName);
        for (const leafName of leafArr) {
          const leafSlug = slugify(leafName);
          await categories.insertOne({
            name: leafName,
            slug: leafSlug,
            parentId: slugToId[subSlug],
          });
          console.log(`      ✅ Leaf: ${leafName}`);
        }
      }
    }

    console.log('🎉 All categories seeded successfully!');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from database');
  }
}

run();
