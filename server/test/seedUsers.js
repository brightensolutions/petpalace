// test/seedUsers.js

/**
 * Standalone script to seed the `users` collection
 * with two sample users.
 * Usage: node test/seedUsers.js
 */

const { MongoClient } = require('mongodb');

// 1) Your full MongoDB URI (make sure it includes the DB name & options)
const uri = 'mongodb+srv://donisingh007:ayush123@cluster0.zpfsvo3.mongodb.net/PetPalace?retryWrites=true&w=majority';

console.log('👉 Using MongoDB URI:', uri);

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('🔌 Connected to database');

    const db = client.db();         // uses DB from URI
    const usersColl = db.collection('users');

    // Optional: clear existing data
    await usersColl.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // 2) Seed data
    const users = [
      { name: 'doni', number: '8769388932' },
      { name: "shivani ma'am", number: '1111111111' }
    ];

    // Insert into `users` collection
    const result = await usersColl.insertMany(users);
    console.log(`🎉 Inserted ${result.insertedCount} users!`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

run();
