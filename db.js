const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // UPDATED: Removed the old deprecated options.
    // The connection string is all you need now.
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/legallens');
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;