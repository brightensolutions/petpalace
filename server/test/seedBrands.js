// test/seedBrands.js

/**
 * Standalone Node.js script to seed the `brands` collection
 * with your list of Premium, Popular, and Specialty brands.
 *
 * Usage:
 *   node test/seedBrands.js
 * After it runs, you can safely delete this file.
 */

const { MongoClient } = require('mongodb');

// 1. Your full MongoDB URI (specify a default DB name and options)
const uri =
  'mongodb+srv://donisingh007:VtRmvtIn0U8pKItk@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';

console.log('👉 Using MongoDB URI:', uri);

const brandGroups = {
  'PREMIUM BRANDS': [
    'Royal Canin',
    'Hills',
    'Purina Pro Plan',
    'Orijen',
    'Acana',
    'Farmina',
  ],
  'POPULAR BRANDS': [
    'Pedigree',
    'Whiskas',
    'Drools',
    'Sheba',
    'Felix',
    'Me-O',
  ],
  'SPECIALTY BRANDS': [
    'Blue Buffalo',
    'Wellness',
    'Taste of the Wild',
    'Canidae',
  ],
};

async function run() {
  let client;

  try {
    console.log('🔗  Creating MongoClient...');
    client = new MongoClient(uri);

    console.log('🌐  Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅  Connected to MongoDB!');

    const db = client.db(); // defaults to “PetPalace”
    const brandsColl = db.collection('brands');

    // Drop old collection & indexes if they exist
    console.log('🗑️  Dropping old brands collection (if it exists)...');
    try {
      await db.dropCollection('brands');
      console.log('🗑️  Old brands collection dropped.');
    } catch {
      console.log('ℹ️  No existing brands collection to drop.');
    }

    // Flatten all brand names into one array
    const allBrandNames = Object.values(brandGroups).flat();

    // Prepare documents
    console.log('📄  Preparing brand documents...');
    const brandDocs = allBrandNames.map(name => ({ name }));

    // Insert into MongoDB
    console.log(`🚀  Inserting ${brandDocs.length} brands...`);
    const result = await brandsColl.insertMany(brandDocs);
    console.log(`🎉  Inserted ${result.insertedCount} brands.`);

  } catch (err) {
    console.error('❌  ERROR seeding brands:', err);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌  Disconnected from database');
    }
  }
}

run();
