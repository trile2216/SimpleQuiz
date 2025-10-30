const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
  try {
    await mongoose.connect( process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Kết nối MongoDB thành công!");
  } catch (error) {
    console.error("Kết nối MongoDB thất bại:", error);
  }
};

module.exports = connectDB;