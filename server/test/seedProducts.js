// test/seedProducts.js

/**
 * Standalone script to seed `products` with correct category_id & brand_id.
 * Usage: node test/seedProducts.js
 */

const { MongoClient } = require('mongodb');

// 1) Your full MongoDB URI (including DB and options)
const uri =
  'mongodb+srv://donisingh007:VtRmvtIn0U8pKItk@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';

console.log('👉 Using MongoDB URI:', uri);

// 2) Product data, including slugs for parent & leaf categories and brand names
const productsData = [
  {
    id: 1,
    name: 'Royal Canin Fit 32 Adult Dry Cat Food',
    slug: 'royal-canin-fit-32-adult-dry-cat-food',
    description:
      'Royal Canin Fit 32 Adult Dry Cat Food complete and balanced nutrition.',
    price: 3248.08,
    original_price: 3499,
    mrp: 3691,
    rating: 4.9,
    review_count: 120,
    parentSlug: 'cat-food',
    categorySlug: 'dry-food',
    brandName: 'Royal Canin',
  },
  {
    id: 2,
    name: 'Royal Canin Persian Adult Dry Cat Food',
    slug: 'royal-canin-persian-adult-dry-cat-food',
    description:
      'Royal Canin Persian Adult Dry Cat Food complete and balanced nutrition.',
    price: 3350,
    original_price: 3699,
    mrp: 3999,
    rating: 4.8,
    review_count: 86,
    parentSlug: 'cat-food',
    categorySlug: 'dry-food',
    brandName: 'Royal Canin',
  },
  {
    id: 3,
    name: 'Royal Canin Maxi Adult Dry Dog Food',
    slug: 'royal-canin-maxi-adult-dry-dog-food',
    description:
      'Royal Canin Maxi Adult Dry Dog Food complete and balanced nutrition.',
    price: 902,
    original_price: 980,
    mrp: 1050,
    rating: 4.7,
    review_count: 70,
    parentSlug: 'dog-food',
    categorySlug: 'dry-food',
    brandName: 'Royal Canin',
  },
  {
    id: 4,
    name: 'Royal Canin Maxi Puppy Dry Dog Food',
    slug: 'royal-canin-maxi-puppy-dry-dog-food',
    description:
      'Royal Canin Maxi Puppy Dry Dog Food complete and balanced nutrition.',
    price: 1950,
    original_price: 2050,
    mrp: 2250,
    rating: 4.8,
    review_count: 65,
    parentSlug: 'dog-food',
    categorySlug: 'puppy-food',
    brandName: 'Royal Canin',
  },
  {
    id: 5,
    name:
      'Farmina N&D Quinoa Digestion Lamb Adult Cat Food',
    slug: 'farmina-nandd-quinoa-digestion-lamb-adult-cat-food',
    description:
      'Farmina N&D Quinoa Digestion Lamb Adult Cat Food complete and balanced nutrition.',
    price: 1865,
    original_price: 1999,
    mrp: 2150,
    rating: 4.9,
    review_count: 45,
    parentSlug: 'cat-food',
    categorySlug: 'premium-food',
    brandName: 'Farmina',
  },
  {
    id: 6,
    name: 'Whiskas Adult Ocean Fish Dry Cat Food',
    slug: 'whiskas-adult-ocean-fish-dry-cat-food',
    description:
      'Whiskas Adult Ocean Fish Dry Cat Food complete and balanced nutrition.',
    price: 249,
    original_price: 299,
    mrp: 339,
    rating: 4.5,
    review_count: 234,
    parentSlug: 'cat-food',
    categorySlug: 'dry-food',
    brandName: 'Whiskas',
  },
  {
    id: 7,
    name:
      'Meowsi Tuna & Chicken Pate Wet Cat Food',
    slug: 'meowsi-tuna-and-chicken-pate-wet-cat-food',
    description:
      'Meowsi Tuna & Chicken Pate Wet Cat Food complete and balanced nutrition.',
    price: 160,
    original_price: 180,
    mrp: 199,
    rating: 4.7,
    review_count: 67,
    parentSlug: 'cat-food',
    categorySlug: 'wet-food',
    brandName: 'Meowsi',
  },
  {
    id: 8,
    name:
      'Farmina N&D Pumpkin Lamb & Blueberry Adult Dog Food',
    slug: 'farmina-nandd-pumpkin-lamb-and-blueberry-adult-dog-food',
    description:
      'Farmina N&D Pumpkin Lamb & Blueberry Adult Dog Food complete and balanced nutrition.',
    price: 3650,
    original_price: 3999,
    mrp: 4250,
    rating: 4.8,
    review_count: 56,
    parentSlug: 'dog-food',
    categorySlug: 'premium-food',
    brandName: 'Farmina',
  },
  {
    id: 9,
    name:
      'Pedigree Adult Chicken & Vegetables Dry Dog Food',
    slug: 'pedigree-adult-chicken-and-vegetables-dry-dog-food',
    description:
      'Pedigree Adult Chicken & Vegetables Dry Dog Food complete and balanced nutrition.',
    price: 1450,
    original_price: 1550,
    mrp: 1700,
    rating: 4.6,
    review_count: 410,
    parentSlug: 'dog-food',
    categorySlug: 'dry-food',
    brandName: 'Pedigree',
  },
  {
    id: 10,
    name:
      'Drools Chicken & Egg Puppy Dry Dog Food',
    slug: 'drools-chicken-and-egg-puppy-dry-dog-food',
    description:
      'Drools Chicken & Egg Puppy Dry Dog Food complete and balanced nutrition.',
    price: 850,
    original_price: 899,
    mrp: 999,
    rating: 4.4,
    review_count: 88,
    parentSlug: 'dog-food',
    categorySlug: 'puppy-food',
    brandName: 'Drools',
  },
  {
    id: 11,
    name: 'Orijen Original Dry Dog Food',
    slug: 'orijen-original-dry-dog-food',
    description:
      'Orijen Original Dry Dog Food complete and balanced nutrition.',
    price: 4750,
    original_price: 4999,
    mrp: 5200,
    rating: 4.9,
    review_count: 312,
    parentSlug: 'dog-food',
    categorySlug: 'dry-food',
    brandName: 'Orijen',
  },
  {
    id: 12,
    name: 'Acana Pacifica Dry Dog Food',
    slug: 'acana-pacifica-dry-dog-food',
    description:
      'Acana Pacifica Dry Dog Food complete and balanced nutrition.',
    price: 4280,
    original_price: 4500,
    mrp: 4700,
    rating: 4.8,
    review_count: 254,
    parentSlug: 'dog-food',
    categorySlug: 'dry-food',
    brandName: 'Acana',
  },
  {
    id: 13,
    name: "Hill's Science Diet Adult Dry Cat Food",
    slug: 'hills-science-diet-adult-dry-cat-food',
    description:
      "Hill's Science Diet Adult Dry Cat Food complete and balanced nutrition.",
    price: 2620,
    original_price: 2750,
    mrp: 2950,
    rating: 4.7,
    review_count: 110,
    parentSlug: 'cat-food',
    categorySlug: 'dry-food',
    brandName: 'Hills',
  },
  {
    id: 14,
    name:
      'Purina Pro Plan Adult Cat Food - Chicken & Rice',
    slug: 'purina-pro-plan-adult-cat-food---chicken-and-rice',
    description:
      'Purina Pro Plan Adult Cat Food - Chicken & Rice complete and balanced nutrition.',
    price: 550,
    original_price: 650,
    mrp: 699,
    rating: 4.8,
    review_count: 178,
    parentSlug: 'cat-food',
    categorySlug: 'dry-food',
    brandName: 'Purina Pro Plan',
  },
  {
    id: 15,
    name: 'Whiskas Wet Cat Food Tuna in Jelly',
    slug: 'whiskas-wet-cat-food-tuna-in-jelly',
    description:
      'Whiskas Wet Cat Food Tuna in Jelly complete and balanced nutrition.',
    price: 48,
    original_price: 55,
    mrp: 60,
    rating: 4.6,
    review_count: 90,
    parentSlug: 'cat-food',
    categorySlug: 'wet-food',
    brandName: 'Whiskas',
  },
  {
    id: 16,
    name:
      'Royal Canin Persian Kitten Dry Cat Food',
    slug: 'royal-canin-persian-kitten-dry-cat-food',
    description:
      'Royal Canin Persian Kitten Dry Cat Food complete and balanced nutrition.',
    price: 475,
    original_price: 520,
    mrp: 560,
    rating: 4.9,
    review_count: 132,
    parentSlug: 'cat-food',
    categorySlug: 'kitten-food',
    brandName: 'Royal Canin',
  },
  {
    id: 17,
    name:
      'Farmina Vet Life Gastrointestinal Cat Food',
    slug: 'farmina-vet-life-gastrointestinal-cat-food',
    description:
      'Farmina Vet Life Gastrointestinal Cat Food complete and balanced nutrition.',
    price: 935,
    original_price: 999,
    mrp: 1100,
    rating: 4.85,
    review_count: 72,
    parentSlug: 'cat-food',
    categorySlug: 'premium-food',
    brandName: 'Farmina',
  },
  {
    id: 18,
    name: 'Drools Meaty Adult Dog Food',
    slug: 'drools-meaty-adult-dog-food',
    description:
      'Drools Meaty Adult Dog Food complete and balanced nutrition.',
    price: 1280,
    original_price: 1350,
    mrp: 1450,
    rating: 4.3,
    review_count: 69,
    parentSlug: 'dog-food',
    categorySlug: 'premium-food',
    brandName: 'Drools',
  },
  {
    id: 19,
    name: 'Pedigree Dentastix Dog Treats',
    slug: 'pedigree-dentastix-dog-treats',
    description:
      'Pedigree Dentastix Dog Treats complete and balanced nutrition.',
    price: 180,
    original_price: 200,
    mrp: 220,
    rating: 4.5,
    review_count: 540,
    parentSlug: 'dog-treats',
    categorySlug: 'dental-treats',
    brandName: 'Pedigree',
  },
  {
    id: 20,
    name:
      'Royal Canin Kitten Wet Cat Food Jelly',
    slug: 'royal-canin-kitten-wet-cat-food-jelly',
    description:
      'Royal Canin Kitten Wet Cat Food Jelly complete and balanced nutrition.',
    price: 110,
    original_price: 120,
    mrp: 135,
    rating: 4.9,
    review_count: 210,
    parentSlug: 'cat-food',
    categorySlug: 'wet-food',
    brandName: 'Royal Canin',
  },
];

async function run() {
  console.log('🔗 Connecting to MongoDB…');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected!');

    const db = client.db();
    const catColl = db.collection('categories');
    const brandColl = db.collection('brands');
    const prodColl = db.collection('products');

    // Drop old products
    console.log('🗑️  Dropping old products collection (if any)…');
    try {
      await db.dropCollection('products');
      console.log('🗑️  Dropped.');
    } catch {
      console.log('ℹ️  No existing products collection.');
    }

    // Insert each product
    for (const p of productsData) {
      // Find parent category
      const parent = await catColl.findOne({ slug: p.parentSlug });
      if (!parent) throw new Error(`Parent category not found: ${p.parentSlug}`);

      // Find leaf category
      const category = await catColl.findOne({
        slug: p.categorySlug,
        parentId: parent._id,
      });
      if (!category) {
        throw new Error(
          `Leaf category not found under ${p.parentSlug}: ${p.categorySlug}`
        );
      }

      // Find brand
      let brand = await brandColl.findOne({ name: p.brandName });
      if (!brand) {
        // auto‐create missing brand
        const res = await brandColl.insertOne({ name: p.brandName });
        brand = { _id: res.insertedId, name: p.brandName };
        console.log(`⚡️ Auto‐inserted missing brand: ${p.brandName}`);
      }

      // Insert product
      await prodColl.insertOne({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        original_price: p.original_price,
        mrp: p.mrp,
        rating: p.rating,
        review_count: p.review_count,
        category_id: category._id,
        brand_id: brand._id,
      });
      console.log(`➕ Inserted product #${p.id}: ${p.name}`);
    }

    console.log('🎉 All products seeded!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

run();
