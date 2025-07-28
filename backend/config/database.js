const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-deals');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    console.log('Please ensure MongoDB is running or install it from: https://www.mongodb.com/try/download/community');
    process.exit(1);
  }
};

module.exports = connectDB;