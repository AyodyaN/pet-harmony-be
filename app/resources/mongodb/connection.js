const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = async() => {
    // Get env configurations
    dotenv.config({ path: `./app/config/${process.env.NODE_ENV}.env` });

    let connURL;
    switch(process.env.NODE_ENV) {
        case "development":
            connURL = `mongodb://${process.env.HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE}`;
            break;
        case "staging":
            connURL = `mongodb://${process.env.HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE}`;
            break;
        case "production":
            connURL = `mongodb://${process.env.HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE}`;
            break;
    }

    mongoose.connect(connURL,{useNewUrlParser:true,  useFindAndModify: false, useUnifiedTopology: true}).then(()=>{
        console.log('Connected successfully to the mongo DB!');
    }).catch((error) => {
        console.log('error',error );
        throw new Error(`Unable connect to the mongo DB! ${error}`);
    });
}

module.exports = connectDB;
