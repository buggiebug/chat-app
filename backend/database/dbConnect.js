const mongoose = require("mongoose");

const dbConnect = (dbUrl)=>{
    mongoose.connect(`${dbUrl}`,{dbName:"chat-app"}).then((res)=>{
        console.log(`database connected with ${res.connection.name} on ${res.connection.host}`);
    });
}

module.exports = dbConnect;
