const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/pathfinders")

.then(()=>{
    console.log("Database is connected!!");
})

.catch((error)=>{
    console.log("Error while Connecting Database ", error);
    
})