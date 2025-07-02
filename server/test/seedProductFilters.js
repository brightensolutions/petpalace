// test/seedProductFilters.js

/**
 * Standalone script to seed the `product_filters` collection.
 * Usage: node test/seedProductFilters.js
 * After it runs, you can delete this file.
 */

const { MongoClient } = require('mongodb');

// 1) Your MongoDB connection URI
const uri =
  'mongodb+srv://donisingh007:VtRmvtIn0U8pKItk@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';

console.log('👉 Using MongoDB URI:', uri);

// 2) The product–filter_option mappings
const mappings = [
  { productId: 1, filterOptionId: 1 },
  { productId: 1, filterOptionId: 12 },
  { productId: 1, filterOptionId: 16 },
  { productId: 1, filterOptionId: 23 },
  { productId: 2, filterOptionId: 1 },
  { productId: 2, filterOptionId: 12 },
  { productId: 2, filterOptionId: 16 },
  { productId: 2, filterOptionId: 23 },
  { productId: 3, filterOptionId: 1 },
  { productId: 3, filterOptionId: 11 },
  { productId: 3, filterOptionId: 16 },
  { productId: 3, filterOptionId: 21 },
  { productId: 3, filterOptionId: 23 },
  { productId: 4, filterOptionId: 1 },
  { productId: 4, filterOptionId: 11 },
  { productId: 4, filterOptionId: 15 },
  { productId: 4, filterOptionId: 21 },
  { productId: 4, filterOptionId: 23 },
  { productId: 5, filterOptionId: 2 },
  { productId: 5, filterOptionId: 12 },
  { productId: 5, filterOptionId: 16 },
  { productId: 5, filterOptionId: 23 },
  { productId: 5, filterOptionId: 36 },
  { productId: 6, filterOptionId: 3 },
  { productId: 6, filterOptionId: 12 },
  { productId: 6, filterOptionId: 16 },
  { productId: 6, filterOptionId: 23 },
  { productId: 6, filterOptionId: 37 },
  { productId: 7, filterOptionId: 4 },
  { productId: 7, filterOptionId: 12 },
  { productId: 7, filterOptionId: 16 },
  { productId: 7, filterOptionId: 24 },
  { productId: 7, filterOptionId: 35 },
  { productId: 7, filterOptionId: 37 },
  { productId: 8, filterOptionId: 2 },
  { productId: 8, filterOptionId: 11 },
  { productId: 8, filterOptionId: 16 },
  { productId: 8, filterOptionId: 23 },
  { productId: 8, filterOptionId: 36 },
  { productId: 9, filterOptionId: 5 },
  { productId: 9, filterOptionId: 11 },
  { productId: 9, filterOptionId: 16 },
  { productId: 9, filterOptionId: 23 },
  { productId: 9, filterOptionId: 35 },
  { productId: 10, filterOptionId: 6 },
  { productId: 10, filterOptionId: 11 },
  { productId: 10, filterOptionId: 15 },
  { productId: 10, filterOptionId: 23 },
  { productId: 10, filterOptionId: 35 },
  { productId: 11, filterOptionId: 7 },
  { productId: 11, filterOptionId: 11 },
  { productId: 11, filterOptionId: 16 },
  { productId: 11, filterOptionId: 23 },
  { productId: 12, filterOptionId: 8 },
  { productId: 12, filterOptionId: 11 },
  { productId: 12, filterOptionId: 16 },
  { productId: 12, filterOptionId: 23 },
  { productId: 12, filterOptionId: 37 },
  { productId: 13, filterOptionId: 9 },
  { productId: 13, filterOptionId: 12 },
  { productId: 13, filterOptionId: 16 },
  { productId: 13, filterOptionId: 23 },
  { productId: 14, filterOptionId: 10 },
  { productId: 14, filterOptionId: 12 },
  { productId: 14, filterOptionId: 16 },
  { productId: 14, filterOptionId: 23 },
  { productId: 14, filterOptionId: 35 },
  { productId: 15, filterOptionId: 3 },
  { productId: 15, filterOptionId: 12 },
  { productId: 15, filterOptionId: 16 },
  { productId: 15, filterOptionId: 24 },
  { productId: 15, filterOptionId: 37 },
  { productId: 16, filterOptionId: 1 },
  { productId: 16, filterOptionId: 12 },
  { productId: 16, filterOptionId: 14 },
  { productId: 16, filterOptionId: 23 },
  { productId: 17, filterOptionId: 2 },
  { productId: 17, filterOptionId: 12 },
  { productId: 17, filterOptionId: 16 },
  { productId: 17, filterOptionId: 23 },
  { productId: 18, filterOptionId: 6 },
  { productId: 18, filterOptionId: 11 },
  { productId: 18, filterOptionId: 16 },
  { productId: 18, filterOptionId: 23 },
  { productId: 19, filterOptionId: 5 },
  { productId: 19, filterOptionId: 11 },
  { productId: 19, filterOptionId: 25 },
  { productId: 20, filterOptionId: 1 },
  { productId: 20, filterOptionId: 12 },
  { productId: 20, filterOptionId: 14 },
  { productId: 20, filterOptionId: 24 },
];

async function run() {
  const client = new MongoClient(uri);
  try {
    console.log('🔗 Connecting to MongoDB…');
    await client.connect();
    console.log('✅ Connected');

    const db = client.db();
    const prodColl = db.collection('products');
    const optsColl = db.collection('filter_options');
    const joinColl = db.collection('product_filters');

    // Drop old collection
    console.log('🗑️  Dropping old product_filters collection (if any)…');
    try {
      await db.dropCollection('product_filters');
      console.log('🗑️  Dropped existing collection');
    } catch {
      console.log('ℹ️  No existing collection to drop');
    }

    // Seed product_filters
    for (const m of mappings) {
      const product = await prodColl.findOne({ id: m.productId });
      if (!product) {
        throw new Error(`Product with id ${m.productId} not found`);
      }
      const option = await optsColl.findOne({ id: m.filterOptionId });
      if (!option) {
        throw new Error(`Filter option with id ${m.filterOptionId} not found`);
      }

      await joinColl.insertOne({
        product_id: product._id,
        filter_option_id: option._id,
      });
      console.log(`➕ Linked product ${m.productId} → option ${m.filterOptionId}`);
    }

    const count = await joinColl.countDocuments();
    console.log(`🎉 All mappings inserted! Total: ${count}`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

run();
