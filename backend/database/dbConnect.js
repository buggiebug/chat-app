const mongoose = require("mongoose");

const dbConnect = async(dbUrl)=>{
    await mongoose.connect(`${dbUrl}`,{dbName:"chat-app"}).then((res)=>{
        console.log(`database connected with ${res.connection.name} on ${res.connection.host}`);
    });
}

module.exports = dbConnect;
