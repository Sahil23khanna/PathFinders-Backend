const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sahilkhanna2330:Ik7H8uZRw79iEBr2@cluster0.fgvi34k.mongodb.net/pathfinders")

.then(()=>{
    console.log("Database is connected!!");
})

.catch((error)=>{
    console.log("Error while Connecting Database ", error);
    
})