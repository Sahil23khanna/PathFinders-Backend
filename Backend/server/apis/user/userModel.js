const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    autoId:{type:String, default:1},
    name:{type:String, default:""},
    email:{type:String, default:""},
    password:{type:String , default:""},
    userType:{type:Number, default:3},
    status:{type:Boolean, default:false},
    createdAt:{type:Date, default:Date.now()}
})

// 1 - admin , 2 - mentor  3 - student

module.exports= mongoose.model("userModel",userSchema)