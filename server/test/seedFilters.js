// test/seedFilters.js

/**
 * Standalone script to seed `filters` and `filter_options` collections.
 * Usage: node test/seedFilters.js
 * After it runs, you can delete this file.
 */

const { MongoClient } = require('mongodb');

// 1) Your MongoDB connection URI (with default DB and options)
const uri =
  'mongodb+srv://donisingh007:VtRmvtIn0U8pKItk@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';

console.log('👉 Using MongoDB URI:', uri);

// 2) Filters list
const filtersData = [
  { id: 1, name: 'Brand' },
  { id: 2, name: 'Shop For' },
  { id: 3, name: 'Life Stage' },
  { id: 4, name: 'Breed Size' },
  { id: 5, name: 'Product Type' },
  { id: 6, name: 'Special Diet' },
  { id: 7, name: 'Price Range' },
  { id: 8, name: 'Protein Source' },
  { id: 9, name: 'Category' },
  { id: 10, name: 'Reviews' },
];

// 3) Filter options list
const optionsData = [
  { id: 1, filterId: 1, value: "Royal Canin",        resultCount: 6 },
  { id: 2, filterId: 1, value: "Farmina",             resultCount: 3 },
  { id: 3, filterId: 1, value: "Whiskas",             resultCount: 2 },
  { id: 4, filterId: 1, value: "Meowsi",              resultCount: 1 },
  { id: 5, filterId: 1, value: "Pedigree",            resultCount: 2 },
  { id: 6, filterId: 1, value: "Drools",              resultCount: 2 },
  { id: 7, filterId: 1, value: "Orijen",              resultCount: 1 },
  { id: 8, filterId: 1, value: "Acana",               resultCount: 1 },
  { id: 9, filterId: 1, value: "Hill's",              resultCount: 1 },
  { id: 10, filterId: 1, value: "Purina Pro Plan",    resultCount: 1 },
  { id: 11, filterId: 2, value: "Dog",                 resultCount: 9 },
  { id: 12, filterId: 2, value: "Cat",                 resultCount: 12 },
  { id: 13, filterId: 2, value: "Other Pets",         resultCount: 25 },
  { id: 14, filterId: 3, value: "Kitten",              resultCount: 9 },
  { id: 15, filterId: 3, value: "Puppy",               resultCount: 5 },
  { id: 16, filterId: 3, value: "Adult",               resultCount: 30 },
  { id: 17, filterId: 3, value: "Senior",              resultCount: 30 },
  { id: 18, filterId: 3, value: "All Life Stages",     resultCount: 29 },
  { id: 19, filterId: 4, value: "Small",               resultCount: 16 },
  { id: 20, filterId: 4, value: "Medium",              resultCount: 36 },
  { id: 21, filterId: 4, value: "Large",               resultCount: 43 },
  { id: 22, filterId: 4, value: "Giant Breed",         resultCount: 50 },
  { id: 23, filterId: 5, value: "Dry Food",            resultCount: 44 },
  { id: 24, filterId: 5, value: "Wet Food",            resultCount: 37 },
  { id: 25, filterId: 5, value: "Treats",              resultCount: 45 },
  { id: 26, filterId: 6, value: "Grain Free",          resultCount: 28 },
  { id: 27, filterId: 6, value: "Limited Ingredient",  resultCount: 49 },
  { id: 28, filterId: 6, value: "Weight Management",   resultCount: 46 },
  { id: 29, filterId: 6, value: "Weight Management",   resultCount: 42 },
  { id: 30, filterId: 6, value: "High Protein",        resultCount: 45 },
  { id: 31, filterId: 7, value: "Under 500",           resultCount: 12 },
  { id: 32, filterId: 7, value: "500-1000",            resultCount: 6 },
  { id: 33, filterId: 7, value: "1000-3000",           resultCount: 36 },
  { id: 34, filterId: 7, value: "3000+",               resultCount: 15 },
  { id: 35, filterId: 8, value: "Chicken",             resultCount: 43 },
  { id: 36, filterId: 8, value: "Lamb",                resultCount: 27 },
  { id: 37, filterId: 8, value: "Fish",                resultCount: 9 },
  { id: 38, filterId: 8, value: "Beef",                resultCount: 9 },
  { id: 39, filterId: 9, value: "All Cat Food",        resultCount: 257 },
  { id: 40, filterId: 9, value: "Dry Food",            resultCount: 156 },
  { id: 41, filterId: 9, value: "Wet Food",            resultCount: 89 },
  { id: 42, filterId: 9, value: "Grain Free Food",     resultCount: 67 },
  { id: 43, filterId: 9, value: "Kitten Food",         resultCount: 54 },
  { id: 44, filterId: 9, value: "Veterinary Food",     resultCount: 23 },
  { id: 45, filterId: 9, value: "Supplements",         resultCount: 34 },
  { id: 46, filterId: 10, value: "Top Rated",          resultCount: 192 },
  { id: 47, filterId: 10, value: "Mid Rated",          resultCount: 206 },
];

async function run() {
  console.log('🔗 Connecting to MongoDB…');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected');

    const db = client.db();
    const filtersColl = db.collection('filters');
    const optionsColl = db.collection('filter_options');

    // Drop old collections
    console.log('🗑️  Dropping old `filters` collection if it exists…');
    try {
      await db.dropCollection('filters');
      console.log('🗑️  Dropped existing `filters`');
    } catch {
      console.log('ℹ️  No existing `filters` to drop');
    }
    console.log('🗑️  Dropping old `filter_options` collection if it exists…');
    try {
      await db.dropCollection('filter_options');
      console.log('🗑️  Dropped existing `filter_options`');
    } catch {
      console.log('ℹ️  No existing `filter_options` to drop');
    }

    // Insert filters and keep a map of relational id → MongoDB _id
    const idMap = {};
    for (const f of filtersData) {
      const res = await filtersColl.insertOne({
        id: f.id,
        name: f.name
      });
      idMap[f.id] = res.insertedId;
      console.log(`➕ Inserted filter: [${f.id}] ${f.name}`);
    }

    // Insert filter_options
    for (const o of optionsData) {
      const parentId = idMap[o.filterId];
      if (!parentId) {
        throw new Error(`Filter ID not found for option ${o.id}`);
      }
      await optionsColl.insertOne({
        id: o.id,
        filter_id: parentId,
        value: o.value,
        result_count: o.resultCount
      });
      console.log(`   ➕ Option [${o.id}] for filter ${o.filterId}: ${o.value}`);
    }

    console.log('🎉 All filters & options seeded!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

run();
