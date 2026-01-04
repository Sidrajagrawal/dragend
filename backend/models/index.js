const mongoose = require('mongoose');

async function connectDB(MONGO_URL){
    try{
        mongoose.connect(MONGO_URL);
        console.log("Database connected successfully.");
    }catch(err){
        console.log("Connection error:",err.message);
        process.exit(1);
    }
}

module.exports = connectDB;