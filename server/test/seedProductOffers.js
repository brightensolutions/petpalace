// test/seedProductOffers.js

/**
 * Standalone script to seed `product_offers` collection.
 * Usage: node test/seedProductOffers.js
 * After it runs, you can delete this file.
 */

const { MongoClient } = require('mongodb');

// 1) Your MongoDB connection URI (with default DB and options)
const uri =
   'mongodb+srv://donisingh007:VtRmvtIn0U8pKItk@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';




console.log('👉 Using MongoDB URI:', uri);

// 2) The offers data
const offersData = [
  { id: 1, productId: 1, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF11', min_cart_value: 299 },
  { id: 2, productId: 1, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF12', min_cart_value: 299 },
  { id: 3, productId: 1, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF13', min_cart_value: 299 },
  { id: 4, productId: 2, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF21', min_cart_value: 1999 },
  { id: 5, productId: 2, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF22', min_cart_value: 1999 },
  { id: 6, productId: 2, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF23', min_cart_value: 1999 },
  { id: 7, productId: 3, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF31', min_cart_value: 499 },
  { id: 8, productId: 3, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF32', min_cart_value: 499 },
  { id: 9, productId: 3, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF33', min_cart_value: 499 },
  { id: 10, productId: 4, description: 'Extra 3% OFF No minimum', coupon_code: 'OFF4', min_cart_value: 499 },
  { id: 11, productId: 4, description: 'Extra 4% OFF No minimum', coupon_code: 'OFF41', min_cart_value: 499 },
  { id: 12, productId: 4, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF42', min_cart_value: 499 },
  { id: 13, productId: 5, description: 'Extra 3% OFF No minimum', coupon_code: 'OFF5', min_cart_value: 1499 },
  { id: 14, productId: 5, description: 'Extra 4% OFF No minimum', coupon_code: 'OFF51', min_cart_value: 1499 },
  { id: 15, productId: 5, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF52', min_cart_value: 1499 },
  { id: 16, productId: 6, description: 'Extra 3% OFF No minimum', coupon_code: 'OFF6', min_cart_value: 1999 },
  { id: 17, productId: 6, description: 'Extra 4% OFF No minimum', coupon_code: 'OFF61', min_cart_value: 1999 },
  { id: 18, productId: 6, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF62', min_cart_value: 1999 },
  { id: 19, productId: 7, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF7', min_cart_value: 499 },
  { id: 20, productId: 7, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF71', min_cart_value: 499 },
  { id: 21, productId: 7, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF72', min_cart_value: 499 },
  { id: 22, productId: 8, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF8', min_cart_value: 999 },
  { id: 23, productId: 8, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF81', min_cart_value: 999 },
  { id: 24, productId: 8, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF82', min_cart_value: 999 },
  { id: 25, productId: 9, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF9', min_cart_value: 1499 },
  { id: 26, productId: 9, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF91', min_cart_value: 1499 },
  { id: 27, productId: 9, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF92', min_cart_value: 1499 },
  { id: 28, productId: 10, description: 'Extra 3% OFF No minimum', coupon_code: 'OFF10', min_cart_value: 1499 },
  { id: 29, productId: 10, description: 'Extra 4% OFF No minimum', coupon_code: 'OFF101', min_cart_value: 1499 },
  { id: 30, productId: 10, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF102', min_cart_value: 1499 },
  { id: 31, productId: 11, description: 'Extra 3% OFF No minimum', coupon_code: 'OFF11', min_cart_value: 499 },
  { id: 32, productId: 11, description: 'Extra 4% OFF No minimum', coupon_code: 'OFF111', min_cart_value: 499 },
  { id: 33, productId: 11, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF112', min_cart_value: 499 },
  { id: 34, productId: 12, description: 'Extra 3% OFF No minimum', coupon_code: 'OFF12', min_cart_value: 499 },
  { id: 35, productId: 12, description: 'Extra 4% OFF No minimum', coupon_code: 'OFF121', min_cart_value: 499 },
  { id: 36, productId: 12, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF122', min_cart_value: 499 },
  { id: 37, productId: 13, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF13', min_cart_value: 1499 },
  { id: 38, productId: 13, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF131', min_cart_value: 1499 },
  { id: 39, productId: 13, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF132', min_cart_value: 1499 },
  { id: 40, productId: 14, description: 'Extra 3% OFF No minimum', coupon_code: 'OFF14', min_cart_value: 299 },
  { id: 41, productId: 14, description: 'Extra 4% OFF No minimum', coupon_code: 'OFF141', min_cart_value: 299 },
  { id: 42, productId: 14, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF142', min_cart_value: 299 },
  { id: 43, productId: 15, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF15', min_cart_value: 299 },
  { id: 44, productId: 15, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF151', min_cart_value: 299 },
  { id: 45, productId: 15, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF152', min_cart_value: 299 },
  { id: 46, productId: 16, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF16', min_cart_value: 299 },
  { id: 47, productId: 16, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF161', min_cart_value: 299 },
  { id: 48, productId: 16, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF162', min_cart_value: 299 },
  { id: 49, productId: 17, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF17', min_cart_value: 499 },
  { id: 50, productId: 17, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF171', min_cart_value: 499 },
  { id: 51, productId: 17, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF172', min_cart_value: 499 },
  { id: 52, productId: 18, description: 'Extra 3% OFF No minimum', coupon_code: 'OFF18', min_cart_value: 1499 },
  { id: 53, productId: 18, description: 'Extra 4% OFF No minimum', coupon_code: 'OFF181', min_cart_value: 1499 },
  { id: 54, productId: 18, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF182', min_cart_value: 1499 },
  { id: 55, productId: 19, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF19', min_cart_value: 299 },
  { id: 56, productId: 19, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF191', min_cart_value: 299 },
  { id: 57, productId: 19, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF192', min_cart_value: 299 },
  { id: 58, productId: 20, description: 'Extra 5% OFF No minimum', coupon_code: 'OFF20', min_cart_value: 299 },
  { id: 59, productId: 20, description: 'Extra 6% OFF No minimum', coupon_code: 'OFF201', min_cart_value: 299 },
  { id: 60, productId: 20, description: 'Extra 7% OFF No minimum', coupon_code: 'OFF202', min_cart_value: 299 },
];

async function run() {
  console.log('🔗 Connecting to MongoDB…');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected');

    const db = client.db();
    const prodColl = db.collection('products');
    const offersColl = db.collection('product_offers');

    // Drop old collection
    console.log('🗑️  Dropping old product_offers collection if it exists…');
    try {
      await db.dropCollection('product_offers');
      console.log('🗑️  Dropped existing collection');
    } catch {
      console.log('ℹ️  No existing collection to drop');
    }

    // Seed offers
    for (const o of offersData) {
      const product = await prodColl.findOne({ id: o.productId });
      if (!product) {
        throw new Error(`Product with id ${o.productId} not found`);
      }

      await offersColl.insertOne({
        id: o.id,
        product_id: product._id,
        description: o.description,
        coupon_code: o.coupon_code,
        min_cart_value: o.min_cart_value,
      });
      console.log(`➕ Inserted offer #${o.id} for product ${o.productId}`);
    }

    console.log('🎉 All offers seeded!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

run();
