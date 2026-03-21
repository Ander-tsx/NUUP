const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('users').dropIndex('user_1');
    console.log('Index user_1 dropped:', result);
  } catch (err) {
    if (err.message.includes('index not found')) {
        console.log('Index user_1 already dropped or not found');
    } else {
        console.error('Error dropping index:', err.message);
    }
  } finally {
    mongoose.connection.close();
  }
}
run();
