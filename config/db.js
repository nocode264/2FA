const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }catch(error){
        console.error('Error connecting to mongoDB: ',error.message);
        process.exit(1);
    }
};

module.exports = connectDB;