// test/seedProductVariants.js

/**
 * Standalone script to seed `product_variants`.
 * Usage: node test/seedProductVariants.js
 */

const { MongoClient } = require('mongodb');

// 1) MongoDB connection URI (must include DB name & options)
const uri =
  'mongodb+srv://donisingh007:VtRmvtIn0U8pKItk@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';

const variantsData = [
  { productId: 1, label: '1 kg', discount_percent: 17.37 },
  { productId: 1, label: '2 kg', discount_percent: 16.66 },
  { productId: 1, label: '3 kg', discount_percent: 16.66 },
  { productId: 2, label: '1 kg', discount_percent: 10.02 },
  { productId: 2, label: '2 kg', discount_percent: 21.93 },
  { productId: 2, label: '5 kg', discount_percent: 22.52 },
  { productId: 3, label: '400 g', discount_percent: 9.44 },
  { productId: 3, label: '2 kg', discount_percent: 23.88 },
  { productId: 3, label: '5 kg', discount_percent: 24.88 },
  { productId: 4, label: '3 kg', discount_percent: 19.29 },
  { productId: 4, label: '400 g', discount_percent: 4.19 },
  { productId: 4, label: '8 kg', discount_percent: 22.36 },
  { productId: 5, label: '3 kg', discount_percent: 4.53 },
  { productId: 5, label: '1.5 kg', discount_percent: 12.75 },
  { productId: 5, label: '3 kg', discount_percent: 14.97 },
  { productId: 6, label: '5 kg', discount_percent: 18.4 },
  { productId: 6, label: '1.2 kg', discount_percent: 9.79 },
  { productId: 6, label: '8 kg', discount_percent: 28.85 },
  { productId: 7, label: '2 kg', discount_percent: 16.83 },
  { productId: 7, label: '1.2 kg', discount_percent: 6.25 },
  { productId: 7, label: '5 kg', discount_percent: 26.36 },
  { productId: 8, label: '5 kg', discount_percent: 19.16 },
  { productId: 8, label: '3 kg', discount_percent: 8.77 },
  { productId: 8, label: '8 kg', discount_percent: 36.33 },
  { productId: 9, label: '1.2 kg', discount_percent: 10.78 },
  { productId: 9, label: '2 kg', discount_percent: 16.1 },
  { productId: 9, label: '5 kg', discount_percent: 21.52 },
  { productId: 10, label: '1.2 kg', discount_percent: 21.01 },
  { productId: 10, label: '3 kg', discount_percent: 10.4 },
  { productId: 10, label: '6 kg', discount_percent: 27.89 },
  { productId: 11, label: 'Pack Of 6', discount_percent: 6.98 },
  { productId: 11, label: 'Pack Of 10', discount_percent: 17.4 },
  { productId: 11, label: 'Pack Of 15', discount_percent: 22.1 },
  { productId: 12, label: 'Pack Of 1', discount_percent: 17.36 },
  { productId: 12, label: 'Pack Of 5', discount_percent: 8.97 },
  { productId: 12, label: 'Pack Of 15', discount_percent: 28.36 },
  { productId: 13, label: '400 g', discount_percent: 14.41 },
  { productId: 13, label: '1 kg', discount_percent: 23.79 },
  { productId: 13, label: '5 kg', discount_percent: 36.09 },
  { productId: 14, label: '2 kg', discount_percent: 17.64 },
  { productId: 14, label: '400 g', discount_percent: 3.86 },
  { productId: 14, label: '5 kg', discount_percent: 28.95 },
  { productId: 15, label: '2 kg', discount_percent: 23.41 },
  { productId: 15, label: '400 g', discount_percent: 18.25 },
  { productId: 15, label: '8 kg', discount_percent: 42.31 },
  { productId: 16, label: '1.2 kg', discount_percent: 4.81 },
  { productId: 16, label: '2.5 kg', discount_percent: 8.58 },
  { productId: 16, label: '10 kg', discount_percent: 15 },
  { productId: 17, label: 'Pack Of 1', discount_percent: 12.09 },
  { productId: 17, label: 'Pack Of 6', discount_percent: 21.68 },
  { productId: 17, label: 'Pack Of 15', discount_percent: 47.82 },
  { productId: 18, label: '3 kg', discount_percent: 16.8 },
  { productId: 18, label: '1.5 kg', discount_percent: 13.11 },
  { productId: 18, label: '8 kg', discount_percent: 22.32 },
  { productId: 19, label: '1.2 kg', discount_percent: 24.74 },
  { productId: 19, label: '400 g', discount_percent: 16.51 },
  { productId: 19, label: '5 kg', discount_percent: 39.21 },
  { productId: 20, label: '3 kg', discount_percent: 24.9 },
  { productId: 20, label: '1.2 kg', discount_percent: 15.72 },
  { productId: 20, label: '10 kg', discount_percent: 40.08 },
];

async function run() {
  const client = new MongoClient(uri);
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected');

    const db = client.db();
    const prodColl = db.collection('products');
    const varColl = db.collection('product_variants');

    // Drop old
    console.log('🗑️  Dropping old product_variants collection...');
    try {
      await db.dropCollection('product_variants');
      console.log('🗑️  Dropped existing collection');
    } catch {
      console.log('ℹ️  No existing collection to drop');
    }

    // Seed variants
    for (const v of variantsData) {
      // Find product by numeric id
      const product = await prodColl.findOne({ id: v.productId });
      if (!product) {
        throw new Error(`Product with id ${v.productId} not found`);
      }
      const insertDoc = {
        product_id: product._id,
        label: v.label,
        discount_percent: v.discount_percent,
      };
      await varColl.insertOne(insertDoc);
      console.log(`➕ Inserted variant for product ${v.productId}: ${v.label}`);
    }

    console.log('🎉 All variants seeded!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

run();
