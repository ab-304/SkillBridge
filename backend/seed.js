const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB Atlas.');
    console.log('[Seeder] Database initialized ready for live data.');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Error connecting to DB:', error);
    process.exit(1);
  }
};

seedDB();
